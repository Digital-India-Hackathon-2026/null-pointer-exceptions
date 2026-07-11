const express = require("express");
const router = express.Router();
const https = require("https");
const Scheme = require("../models/Scheme");
const { matchAndRank } = require("../utils/ranking");

function callGeminiAPI(apiKey, prompt) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
            }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            port: 443,
            path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(body);
                        resolve(parsed);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(`Status: ${res.statusCode}, Body: ${body}`));
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

router.post("/", async (req, res) => {
    try {
        const { message, profile, history, lang } = req.body;
        const allSchemes = await Scheme.find();

        // Determine language-specific links
        const checkProfileLink = lang === 'hi' ? '[योग्यता जाँचें](/checker)' : '[Eligibility Checker](/checker)';
        const profileLink = lang === 'hi' ? '[मेरी प्रोफ़ाइल](/profile)' : '[My Profile](/profile)';

        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            // 1. GENERATIVE MODE (Gemini API)
            const schemesList = allSchemes.map(s => `
ID: ${s._id}
Model Name: ${s.name}
Provider Type: ${s.providerType}
Source/Ministry/Provider: ${s.source}
Categories: ${s.categories.join(", ")}
Description: ${s.description}
Benefit: ${s.benefitDescription || `₹${s.benefitAmount}`}
Eligibility: age ${s.eligibility.minAge} to ${s.eligibility.maxAge}, gender ${s.eligibility.gender}, max income ${s.eligibility.maxIncome || 'No limit'}, occupation ${s.eligibility.occupation.join(", ") || 'Any'}, social category ${s.eligibility.socialCategory.join(", ") || 'Any'}, states ${s.eligibility.states.join(", ") || 'All India'}, disability ${s.eligibility.disabilityRequired ? 'Required' : 'Not required'}, maritalStatus ${s.eligibility.maritalStatus.join(", ") || 'Any'}
Required Documents: ${s.documentsRequired.join(", ")}
Application Steps: ${s.applicationSteps.join(" -> ")}
Apply Mode: ${s.applyMode}
Apply Link: ${s.applyUrl || ''}
      `).join("\n---\n");

            let prompt = `You are a helpful and caring welfare schemes AI Support Assistant for the BenefitBridge portal.
      
Your system language is currently set to: ${lang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}. Please respond in this language.

DATABASE OF AVAILABLE SCHEMES:
${schemesList}

USER PROFILE CONTEXT:
${profile ? JSON.stringify(profile) : "Guest user (no profile details provided yet)."}

INSTRUCTIONS:
1. If the user asks for recommendations, evaluates eligibility, asks for general suggestions or starts the session by seeking benefits, check the USER PROFILE CONTEXT if available, map it against the DATABASE OF AVAILABLE SCHEMES, and recommend the best matching schemes.
2. If the user profile details are missing or incomplete, politely ask them to share their demographic details (age, gender, income, occupation, etc.) or recommend using our ${checkProfileLink} page.
3. When referencing a scheme, you MUST format it as a clickable markdown hyperlink in the format: [Scheme Name](/schemes/SCHEME_ID) using their ID (mongodb _id field listed above), so they can click and visit it on our site.
4. Keep your responses concise, friendly, and structured using markdown headings, list bullets, or bold text.
5. If they write in Hindi/Hinglish, respond in Hindi. If in English, respond in English.
6. Do not mention any schemes that are not in the database listings unless giving brief external general comparison.
7. Be extremely polite and citizen-focused.

`;

            if (history && history.length > 0) {
                prompt += "\nCHAT HISTORY:\n" + history.map(h => `${h.role === 'model' || h.role === 'assistant' ? 'Assistant' : 'User'}: ${h.text}`).join("\n") + "\n";
            }

            prompt += `\nUser's message: ${message}\nAssistant:`;

            try {
                const resJson = await callGeminiAPI(apiKey, prompt);
                const answer = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to formulate a response.";
                return res.json({ reply: answer });
            } catch (geminiError) {
                console.error("Gemini call failed, falling back to local search:", geminiError);
                // Fall back to rule-based engine if Gemini fails (e.g. rate limit / network error)
            }
        }

        // 2. FALLBACK MODE: Smart local recommendations rules engine
        let reply = "";
        const text = (message || "").toLowerCase();

        // Determine if a profile is present
        const hasProfile = profile && profile.age;

        // Run local matchmaking if user profile is known:
        let matched = [];
        if (hasProfile) {
            const p = {
                age: Number(profile.age || 0),
                gender: profile.gender || "any",
                occupation: profile.occupation || "student",
                maritalStatus: profile.maritalStatus || "",
                state: profile.state || "",
                socialCategory: profile.socialCategory || "",
                hasDisability: profile.hasDisability || "no",
                income: profile.income !== undefined && profile.income !== "" ? Number(profile.income) : null,
                incomeUnknown: profile.incomeUnknown || false
            };
            matched = matchAndRank(allSchemes, p);
        }

        if (text === "/recommend" || text.includes("recommend") || text.includes("suggest") || text.includes("suitable") || text.includes("eligible") || text.includes("fit") || text.includes("find")) {
            if (hasProfile) {
                if (matched.length > 0) {
                    reply = lang === 'hi'
                        ? `नमस्ते **${profile.name || "नागरिक"}**! आपके प्रोफ़ाइल विवरण के अनुसार, ये योजनाएं आपके लिए सबसे उपयुक्त हो सकती हैं:\n\n`
                        : `Hi **${profile.name || "Citizen"}**! Based on your profile details, here are the top schemes recommended for you:\n\n`;

                    matched.slice(0, 3).forEach((s, idx) => {
                        reply += `${idx + 1}. **[${s.name}](/schemes/${s._id})**\n`;
                        reply += `   - **Category**: ${s.categories.join(", ")}\n`;
                        reply += `   - **Benefit**: ${s.benefitDescription || `₹${s.benefitAmount}`}\n`;
                        reply += `   - **Source**: ${s.source}\n\n`;
                    });
                    reply += lang === 'hi'
                        ? `विवरण और चरण-दर-चरण मार्गदर्शिका देखने के लिए किसी भी योजना पर क्लिक करें। आप ${checkProfileLink} या ${profileLink} पर और विवरण संपादित कर सकते हैं।`
                        : `Click any scheme to see documents required and steps. You can adjust your metrics anytime on the ${checkProfileLink} or ${profileLink}.`;
                } else {
                    reply = lang === 'hi'
                        ? `नमस्ते! हमने आपके प्रोफ़ाइल के लिए सटीक मिलान वाली कोई योजना नहीं पाई। कृपया अधिक लाभ अनलॉक करने के लिए ${checkProfileLink} में थोड़ी जानकारी बदलने का प्रयास करें।`
                        : `Hello! We couldn't find any direct eligible schemes for your current profile. Try adjusting details on the ${checkProfileLink} to see other policies.`;
                }
            } else {
                reply = lang === 'hi'
                    ? `योजनाओं की सिफ़ारिशें प्राप्त करने के लिए, आपका प्रोफ़ाइल विवरण जानना आवश्यक है।\nकृपया **उम्र, पेशा (किसान, छात्र, उद्यमी, आदि), वार्षिक आय, और राज्य** बताएं, या सीधे ${checkProfileLink} का उपयोग करें!`
                    : `To suggest personalized schemes, I need to know a few details about you.\nCould you share your **age, occupation (farmer, student, entrepreneur, etc.), annual family income, and state**? Alternatively, try the ${checkProfileLink}!`;
            }
        } else {
            // Keyword check
            let filterCat = "";
            if (text.includes("farmer") || text.includes("kisan") || text.includes("कृषि") || text.includes("किसान")) {
                filterCat = "farmer";
            } else if (text.includes("student") || text.includes("scholarship") || text.includes("शिक्षा") || text.includes("छात्र")) {
                filterCat = "student";
            } else if (text.includes("widow") || text.includes("women") || text.includes("woman") || text.includes("महिला")) {
                filterCat = "women";
            } else if (text.includes("disabled") || text.includes("disability") || text.includes("दिव्यांग") || text.includes("अक्षम")) {
                filterCat = "disabled";
            } else if (text.includes("entrepreneur") || text.includes("business") || text.includes("loan") || text.includes("ऋण") || text.includes("उद्यमी") || text.includes("लोन")) {
                filterCat = "entrepreneur";
            }

            if (filterCat) {
                const matchingDetails = allSchemes.filter(s => s.categories.includes(filterCat) || s.name.toLowerCase().includes(filterCat));
                if (matchingDetails.length > 0) {
                    reply = lang === 'hi'
                        ? `यहाँ **${filterCat}** श्रेणी में कुछ लोकप्रिय योजनाएँ हैं:\n\n`
                        : `Here are some popular schemes under the **${filterCat}** category:\n\n`;

                    matchingDetails.slice(0, 3).forEach((s) => {
                        reply += `- **[${s.name}](/schemes/${s._id})**: ${s.description} (Benefit: ${s.benefitDescription || `₹${s.benefitAmount}`})\n`;
                    });
                }
            }

            // Specific scheme names
            if (!reply) {
                const matchedScheme = allSchemes.find(s => text.includes(s.name.toLowerCase()) || (s.description && text.includes(s.description.toLowerCase())));
                if (matchedScheme) {
                    reply = lang === 'hi'
                        ? `यहाँ **[${matchedScheme.name}](/schemes/${matchedScheme._id})** की जानकारी है:\n\n` +
                        `- **संस्था**: ${matchedScheme.source}\n` +
                        `- **लाभ**: ${matchedScheme.benefitDescription || `₹${matchedScheme.benefitAmount}`}\n` +
                        `- **दस्तावेज़ कड़े**: ${matchedScheme.documentsRequired.join(", ")}\n` +
                        `- **विवरण**: ${matchedScheme.description}\n`
                        : `Here are details for **[${matchedScheme.name}](/schemes/${matchedScheme._id})**:\n\n` +
                        `- **Provider**: ${matchedScheme.source}\n` +
                        `- **Benefit**: ${matchedScheme.benefitDescription || `₹${matchedScheme.benefitAmount}`}\n` +
                        `- **Documents Required**: ${matchedScheme.documentsRequired.join(", ")}\n` +
                        `- **About**: ${matchedScheme.description}\n`;
                }
            }

            // Default greeting / response
            if (!reply) {
                reply = lang === 'hi'
                    ? `नमस्ते! मैं आपका कल्याण योजना सहायक हूँ। मैं निम्नलिखित श्रेणियों के बारे में आपके प्रश्नों का उत्तर दे सकता हूँ:\n` +
                    `- **किसान कल्याण योजनाएं** (उदा. PM-KISAN, फ़सल बीमा)\n` +
                    `- **छात्रवृत्ति और अनुदान** (उदा. Tata Grant)\n` +
                    `- **महिला एवं विधवा आर्थिक सहायता** (उदा. Vidya Laxmi)\n` +
                    `- **दिव्यांग पुनर्वास योजनाएं**\n` +
                    `- **उद्यमी और व्यापार ऋण** (उदा. Shishu, Mudra, NHFDC)\n\n` +
                    `आप सिफ़ारिशें पाने के लिए "मुझे योजनाएं बताएं" भी कह सकते हैं या ${checkProfileLink} पर जाकर अपनी योग्यता जाँच सकते हैं।`
                    : `Hello! I am your AI Welfare Schemes Assistant. I can help search and answer queries regarding:\n` +
                    `- **Farmer Support Schemes** (e.g. PM-KISAN, crop insurance)\n` +
                    `- **Scholarships & Education Grants** (e.g. Tata Trusts Grant, Reliance Scholarship)\n` +
                    `- **Women & Widow Livelihoods** (e.g. Vidya Laxmi support)\n` +
                    `- **Rehabilitation Aids for Disabled citizens**\n` +
                    `- **Business Loans for Entrepreneurs** (e.g. MUDRA loan, NHFDC funding)\n\n` +
                    `Ask me any question, type "recommend" for profile recommendations, or try the ${checkProfileLink} page.`;
            }
        }

        if (!apiKey) {
            reply += `\n\n*(Note: To activate full generative AI responses, configure a GEMINI_API_KEY in the backend .env file.)*`;
        }

        return res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process chat query" });
    }
});

module.exports = router;
