import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getProfiles, sendChatMessage } from '../api';
import { SCHEMES } from '../mock';

export default function ChatBot() {
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    const messagesEndRef = useRef(null);

    // Dynamic values depending on language
    const titleText = lang === 'hi' ? 'AI सहायक' : 'AI Assistant';
    const placeholderText = lang === 'hi' ? 'योजनाओं के बारे में पूछें...' : 'Ask about schemes...';
    const onlineStatusText = lang === 'hi' ? 'सक्रिय' : 'Online';

    // Recommendations query button options
    const defaultSuggestions = lang === 'hi'
        ? [
            'मुझे उपयुक्त योजनाएं बताएं',
            'PM Kisan के लिए क्या दस्तावेज़ चाहिए?',
            'सुकन्या समृद्धि योजना क्या है?',
            'मुद्रा लोन योजनाएं क्या हैं?'
        ]
        : [
            'Recommend schemes for me',
            'What documents are needed for PM Kisan?',
            'What is Sukanya Samriddhi Yojana?',
            'What loans are available for business?'
        ];

    const [suggestions, setSuggestions] = useState(defaultSuggestions);

    // Sync profile details when chatbot drawer opens
    useEffect(() => {
        if (!isOpen) return;

        const token = localStorage.getItem("token");
        if (token) {
            getProfiles(token)
                .then(profs => {
                    if (profs && profs.length > 0) {
                        const self = profs.find(p => p.isSelf) || profs[0];
                        setProfile({
                            name: self.label,
                            age: self.age,
                            gender: self.gender,
                            occupation: self.occupation,
                            income: self.income,
                            socialCategory: self.socialCategory,
                            state: self.state
                        });
                    } else {
                        loadGuestProfile();
                    }
                })
                .catch(err => {
                    console.error("Error loading profiles for chatbot:", err);
                    loadGuestProfile();
                });
        } else {
            loadGuestProfile();
        }
    }, [isOpen]);

    const loadGuestProfile = () => {
        try {
            const guest = JSON.parse(localStorage.getItem("userProfile"));
            if (guest) {
                setProfile({
                    name: guest.name || "Guest",
                    age: guest.age,
                    gender: guest.gender,
                    occupation: guest.occupation,
                    income: guest.income,
                    socialCategory: guest.socialCategory,
                    state: guest.state
                });
            } else {
                setProfile(null);
            }
        } catch (e) {
            setProfile(null);
        }
    };

    // Add initial greeting based on profile state
    useEffect(() => {
        if (!isOpen) return;

        if (messages.length === 0) {
            let welcomeText = "";
            if (profile && profile.age) {
                const occLabel = profile.occupation.charAt(0).toUpperCase() + profile.occupation.slice(1);
                welcomeText = lang === 'hi'
                    ? `नमस्ते **${profile.name || "नागरिक"}**! मुझे दिख रहा है कि आप **${profile.age} वर्ष**, **${profile.gender === 'male' ? 'पुरुष' : profile.gender === 'female' ? 'महिला' : 'नागरिक'}** और **${occLabel === 'Student' ? 'छात्र' : occLabel === 'Farmer' ? 'किसान' : occLabel}** हैं।\n\nमैं आपकी कैसे मदद कर सकता हूँ? योजनाओं की सिफ़ारिशों के लिए नीचे बटन पर क्लिक करें!`
                    : `Hi **${profile.name || "Citizen"}**! I see your profile details: **${profile.age} years old**, **${profile.gender}**, **${occLabel}**.\n\nType **recommend** (or click the query pill below) and I will list matching welfare benefits for you!`;
            } else {
                welcomeText = lang === 'hi'
                    ? `नमस्ते! मैं आपका **BenefitBridge AI सहायक** हूँ। मैं सरकारी और निजी कल्याणकारी योजनाओं को खोजने में आपकी मदद कर सकता हूँ।\n\nव्यक्तिगत सिफ़ारिशों के लिए, कृपया अपना प्रोफ़ाइल विवरण बताएं या [योग्यता जाँचें](/checker) पर जाएं!`
                    : `Hello! I am your **BenefitBridge AI Assistant**. I can help you search for government schemes, scholarships, and grants.\n\nTo get personalized recommendations, share your demographic details or visit our [Eligibility Checker](/checker)!`;
            }

            setMessages([{ role: 'assistant', text: welcomeText }]);
        }
    }, [isOpen, profile, lang]);

    // Adjust suggestion chips language
    useEffect(() => {
        setSuggestions(defaultSuggestions);
    }, [lang]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Client-side rule matching fallback
    const localChatFallback = (messageText, currentProfile, langContext) => {
        const text = (messageText || "").toLowerCase();
        const hasProfile = currentProfile && currentProfile.age;

        let matched = [];
        if (hasProfile) {
            matched = SCHEMES.filter(s => {
                const eg = s.eligibility;
                if (!eg) return false;
                const age = Number(currentProfile.age || 0);
                const income = currentProfile.income !== undefined && currentProfile.income !== "" ? Number(currentProfile.income) : null;

                // Age check
                if (eg.age && (age < eg.age[0] || age > eg.age[1])) return false;

                // Income check
                if (eg.income !== undefined && income !== null && income > eg.income) return false;

                // Gender check
                if (eg.gender && !eg.gender.includes('any') && !eg.gender.includes(currentProfile.gender)) return false;

                // Occupation check
                if (eg.occupation && !eg.occupation.includes('any') && !eg.occupation.includes(currentProfile.occupation)) return false;

                // Category check
                if (eg.categories && !eg.categories.includes('any') && currentProfile.socialCategory && !eg.categories.includes(currentProfile.socialCategory)) return false;

                return true;
            });
        }

        const checkProfileLink = langContext === 'hi' ? '[योग्यता जाँचें](/checker)' : '[Eligibility Checker](/checker)';
        const profileLink = langContext === 'hi' ? '[मेरी प्रोफ़ाइल](/profile)' : '[My Profile](/profile)';

        let reply = "";

        if (text === "/recommend" || text.includes("recommend") || text.includes("suggest") || text.includes("suitable") || text.includes("eligible") || text.includes("fit") || text.includes("find")) {
            if (hasProfile) {
                if (matched.length > 0) {
                    reply = langContext === 'hi'
                        ? `नमस्ते **${currentProfile.name || "नागरिक"}**! आपके प्रोफ़ाइल विवरण के अनुसार, ये योजनाएं आपके लिए सबसे उपयुक्त हो सकती हैं:\n\n`
                        : `Hi **${currentProfile.name || "Citizen"}**! Based on your profile details, here are the top schemes recommended for you:\n\n`;

                    matched.slice(0, 3).forEach((s, idx) => {
                        reply += `${idx + 1}. **[${s.title}](/schemes/${s.id})**\n`;
                        reply += `   - **Category**: ${s.category}\n`;
                        reply += `   - **Benefit**: ${s.benefit}\n`;
                        reply += `   - **Source**: ${s.ministry || s.provider}\n\n`;
                    });
                    reply += langContext === 'hi'
                        ? `विवरण और आवेदन की जानकारी देखने के लिए किसी भी योजना पर क्लिक करें। आप ${checkProfileLink} या ${profileLink} पर और विवरण संपादित कर सकते हैं।`
                        : `Click any scheme to see documents required and steps. You can adjust your metrics anytime on the ${checkProfileLink} or ${profileLink}.`;
                } else {
                    reply = langContext === 'hi'
                        ? `नमस्ते! हमने आपके प्रोफ़ाइल के लिए सटीक मिलान वाली कोई योजना नहीं पाई। कृपया अधिक लाभ अनलॉक करने के लिए ${checkProfileLink} में थोड़ी जानकारी बदलने का प्रयास करें।`
                        : `Hello! We couldn't find any direct eligible schemes for your current profile. Try adjusting details on the ${checkProfileLink} to see other policies.`;
                }
            } else {
                reply = langContext === 'hi'
                    ? `सिफ़ारिशें प्राप्त करने के लिए, आपका प्रोफ़ाइल विवरण जानना आवश्यक है।\nकृपया **उम्र, पेशा (किसान, छात्र, उद्यमी, आदि), वार्षिक आय, और राज्य** बताएं, या सीधे ${checkProfileLink} का उपयोग करें!`
                    : `To suggest personalized schemes, I need to know a few details about you.\nCould you share your **age, occupation (farmer, student, entrepreneur, etc.), annual family income, and state**? Alternatively, try the ${checkProfileLink}!`;
            }
        } else {
            // Keyword matching
            let filterCat = "";
            if (text.includes("farmer") || text.includes("kisan") || text.includes("कृषि") || text.includes("किसान")) {
                filterCat = "farmer";
            } else if (text.includes("student") || text.includes("scholarship") || text.includes("शिक्षा") || text.includes("छात्र")) {
                filterCat = "student";
            } else if (text.includes("widow") || text.includes("women") || text.includes("woman") || text.includes("महिला")) {
                filterCat = "women";
            } else if (text.includes("disabled") || text.includes("disability") || text.includes("दिव्यांग") || text.includes("अक्षम")) {
                filterCat = "senior";
            } else if (text.includes("entrepreneur") || text.includes("business") || text.includes("loan") || text.includes("ऋण") || text.includes("उद्यमी") || text.includes("लोन")) {
                filterCat = "entrepreneur";
            }

            if (filterCat) {
                const matchingDetails = SCHEMES.filter(s => s.category === filterCat || s.title.toLowerCase().includes(filterCat));
                if (matchingDetails.length > 0) {
                    reply = langContext === 'hi'
                        ? `यहाँ **${filterCat}** श्रेणी में कुछ लोकप्रिय योजनाएँ हैं:\n\n`
                        : `Here are some popular schemes under the **${filterCat}** category:\n\n`;

                    matchingDetails.slice(0, 3).forEach((s) => {
                        reply += `- **[${s.title}](/schemes/${s.id})**: ${s.description} (Benefit: ${s.benefit})\n`;
                    });
                }
            }

            // Scheme details matching
            if (!reply) {
                const matchedScheme = SCHEMES.find(s => text.includes(s.title.toLowerCase()) || text.includes(s.id.toLowerCase()) || (s.description && text.includes(s.description.toLowerCase())));
                if (matchedScheme) {
                    reply = langContext === 'hi'
                        ? `यहाँ **[${matchedScheme.title}](/schemes/${matchedScheme.id})** की जानकारी है:\n\n` +
                        `- **संस्था**: ${matchedScheme.ministry || matchedScheme.provider}\n` +
                        `- **लाभ**: ${matchedScheme.benefit}\n` +
                        `- **दस्तावेज़**: ${matchedScheme.documents?.join(", ") || "Aadhaar Card, Identity Proof"}\n` +
                        `- **विवरण**: ${matchedScheme.description}\n`
                        : `Here are details for **[${matchedScheme.title}](/schemes/${matchedScheme.id})**:\n\n` +
                        `- **Provider**: ${matchedScheme.ministry || matchedScheme.provider}\n` +
                        `- **Benefit**: ${matchedScheme.benefit}\n` +
                        `- **Documents Required**: ${matchedScheme.documents?.join(", ") || "Aadhaar Card, Identity Proof"}\n` +
                        `- **About**: ${matchedScheme.description}\n`;
                }
            }

            // Default response
            if (!reply) {
                reply = langContext === 'hi'
                    ? `नमस्ते! मैं आपका कल्याण योजना सहायक हूँ। मैं निम्नलिखित श्रेणियों के बारे में आपके प्रश्नों का उत्तर दे सकता हूँ:\n` +
                    `- **किसान कल्याण योजनाएं** (उदा. PM Kisan)\n` +
                    `- **छात्रवृत्ति और अनुदान** (उदा. Tata Pankh Scholarship, Reliance Scholarship)\n` +
                    `- **महिला आर्थिक सहायता** (उदा. Sukanya Samriddhi)\n` +
                    `- **व्यापार और मुद्रा ऋण** (उदा. Mudra Yojana, Startup Seed Fund)\n\n` +
                    `आप सिफ़ारिशें पाने के लिए "सिफ़ारिश" कह सकते हैं या ${checkProfileLink} पर जाकर अपनी योग्यता जाँच सकते हैं।`
                    : `Hello! I am your AI Welfare Schemes Assistant. I can help search and answer queries regarding:\n` +
                    `- **Farmer Support Schemes** (e.g. PM Kisan, HDFC Parivartan)\n` +
                    `- **Scholarships & Education Grants** (e.g. NSP Central, Tata Pankh Scholarship, Reliance Scholarship)\n` +
                    `- **Women Livelihoods** (e.g. Sukanya Samriddhi, PMMVY)\n` +
                    `- **Business Loans for Entrepreneurs** (e.g. MUDRA loan, Startup Seed Fund)\n\n` +
                    `Ask me any question, type "recommend" for profile recommendations, or try the ${checkProfileLink} page.`;
            }
        }

        return { reply };
    };

    const handleSend = async (messageText) => {
        const textToSend = messageText || input;
        if (!textToSend.trim()) return;

        if (!messageText) setInput('');

        // Append user message
        const userMsg = { role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const chatHistory = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                text: m.text
            }));

            // Try sending query to server first
            const res = await sendChatMessage(textToSend, profile, chatHistory, lang);
            setMessages(prev => [...prev, { role: 'assistant', text: res.reply }]);
        } catch (err) {
            console.warn("Connection to server failed. Running local AI client match fallback:", err);
            // Backend not running / connection failed! Fallback to client-side rule matches immediately!
            const fallbackRes = localChatFallback(textToSend, profile, lang);
            setMessages(prev => [...prev, { role: 'assistant', text: fallbackRes.reply }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChatClick = (e) => {
        const anchor = e.target.closest("a.chat-link");
        if (anchor) {
            e.preventDefault();
            const url = anchor.getAttribute("href");
            if (url) {
                navigate(url);
                setIsOpen(false);
            }
        }
    };

    const formatMessageHTML = (text) => {
        if (!text) return "";
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Links: [label](/path)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, href) => {
            return `<a href="${href}" class="chat-link text-emerald-600 font-semibold cursor-pointer underline hover:text-emerald-700 transition-colors">${label}</a>`;
        });

        // Bold: **text**
        html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

        // Bullets: - item
        html = html.replace(/^\s*-\s+(.+)$/gm, '<li class="ml-4 list-disc my-1">$1</li>');

        // Numbered List: 1. item
        html = html.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li class="ml-4 list-decimal my-1">$2</li>');

        // Paragraph Line breaks
        html = html.replace(/\n/g, "<br />");

        return html;
    };

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
            {isOpen && (
                <div className="w-[360px] sm:w-[400px] h-[550px] max-h-[80vh] bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-4 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white/10 rounded-xl grid place-items-center relative border border-white/10">
                                <Bot size={20} className="text-white" />
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-emerald-600 ring-2 ring-emerald-400/20" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold tracking-tight leading-tight">{titleText}</h3>
                                <span className="text-[10px] text-emerald-100 flex items-center gap-1 font-medium mt-0.5">
                                    {onlineStatusText}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div
                        onClick={handleChatClick}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70"
                    >
                        {messages.map((m, idx) => {
                            const isAssistant = m.role === 'assistant';
                            return (
                                <div key={idx} className={`flex items-start gap-2.5 ${isAssistant ? '' : 'flex-row-reverse'}`} style={{ flexDirection: isAssistant ? 'row' : 'row-reverse' }}>
                                    <div className={`h-8 w-8 rounded-full grid place-items-center shrink-0 border text-xs font-semibold ${isAssistant
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : 'bg-slate-900 text-white border-slate-800'
                                        }`}>
                                        {isAssistant ? <Bot size={14} /> : <User size={14} />}
                                    </div>
                                    <div
                                        className={`max-w-[78%] p-3.5 rounded-2xl text-sm leading-relaxed ${isAssistant
                                            ? 'bg-white border border-slate-205/60 rounded-tl-sm text-slate-800 shadow-sm'
                                            : 'bg-slate-900 text-white rounded-tr-sm shadow-sm'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: formatMessageHTML(m.text) }}
                                    />
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex items-start gap-2.5">
                                <div className="h-8 w-8 rounded-full grid place-items-center shrink-0 border bg-emerald-50 text-emerald-700 border-emerald-100 text-xs">
                                    <Bot size={14} />
                                </div>
                                <div className="p-3 bg-white border border-slate-205/60 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center justify-center min-w-[70px]">
                                    <div className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick recommendations chips */}
                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
                        {suggestions.map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(chip)}
                                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-full text-xs text-slate-700 hover:text-emerald-750 font-medium transition-all shrink-0 cursor-pointer shadow-sm hover:shadow"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    {/* Input Form */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="p-3 bg-white border-t border-slate-150 flex items-center gap-2 shrink-0"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={placeholderText}
                            disabled={isLoading}
                            className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none text-slate-800 text-sm py-2.5 px-4 rounded-full transition-colors disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-emerald-650 cursor-pointer shadow shadow-emerald-600/10 shrink-0"
                        >
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={toggleChat}
                className={`h-14 w-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer relative border font-semibold ${isOpen
                    ? 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800 hover:rotate-90'
                    : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-600 hover:from-emerald-500 hover:to-teal-650 shadow-emerald-600/20'
                    }`}
                aria-label="Toggle chat assistant"
            >
                {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
                {!isOpen && (
                    <span className="absolute -top-1.5 -right-1 h-5 w-5 bg-amber-500 text-[10px] font-bold text-white rounded-full grid place-items-center ring-2 ring-white animate-pulse">
                        AI
                    </span>
                )}
            </button>
        </div>
    );
}
