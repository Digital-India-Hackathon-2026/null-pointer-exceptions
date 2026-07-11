const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const Scheme = require("../models/Scheme");

async function run() {
    const mockPath = path.join(__dirname, "../../frontend/src/mock.js");
    let content = fs.readFileSync(mockPath, "utf8");

    const startIndex = content.indexOf("export const SCHEMES = [");
    if (startIndex === -1) {
        console.error("Could not find SCHEMES array in mock.js");
        process.exit(1);
    }

    let schemesStr = content.slice(startIndex);
    schemesStr = schemesStr.replace("export const SCHEMES =", "const mockSchemes =");

    const nextExportIndex = schemesStr.indexOf("export const STATS =");
    if (nextExportIndex !== -1) {
        schemesStr = schemesStr.substring(0, nextExportIndex);
    }

    let mockSchemes;
    try {
        eval(schemesStr);
    } catch (e) {
        console.error("Failed to eval mock schemes:", e);
        process.exit(1);
    }

    // Map mockSchemes to Mongoose Scheme Schema
    const mapped = mockSchemes.map((s, idx) => {
        try {
            const providerType = s.type === "private" ? "private" : "government";
            const source = s.ministry || s.provider || "Government of India";

            const categories = s.category === "women" ? ["woman"] : [s.category];
            if (s.tags) {
                s.tags.forEach(tag => {
                    const lower = tag.toLowerCase();
                    let catMatch = lower;
                    if (lower === "women") catMatch = "woman";
                    if (
                        ["student", "farmer", "employee", "woman", "widow", "senior", "entrepreneur", "disabled", "low-income", "health"].includes(
                            catMatch
                        )
                    ) {
                        if (!categories.includes(catMatch)) categories.push(catMatch);
                    }
                });
            }

            let benefitAmount = 0;
            if (s.benefit) {
                const numbers = s.benefit.replace(/,/g, "").match(/\d+/g);
                if (numbers && numbers.length > 0) {
                    benefitAmount = Math.max(...numbers.map(Number));
                }
            }

            let deadline = null;
            if (s.deadline && s.deadline !== "Ongoing" && s.deadline !== "rolling") {
                try {
                    const parsed = new Date(s.deadline);
                    if (!isNaN(parsed.getTime())) {
                        deadline = parsed;
                    }
                } catch (err) { }
            }

            const disabilityRequired =
                s.category === "disabled" ||
                (s.eligibility &&
                    s.eligibility.categories &&
                    s.eligibility.categories.some &&
                    s.eligibility.categories.some(c => typeof c === "string" && c.toLowerCase().includes("disabled"))) ||
                (s.tags && s.tags.some(t => typeof t === "string" && t.toLowerCase() === "disabled")) ||
                false;

            let socialCategory = [];
            if (s.eligibility && s.eligibility.categories) {
                socialCategory = s.eligibility.categories.filter(c => c !== "any");
            }

            let occupation = [];
            if (s.eligibility && s.eligibility.occupation) {
                occupation = s.eligibility.occupation.filter(o => o !== "any");
            }

            let gender = "any";
            if (s.eligibility && s.eligibility.gender) {
                const gList = s.eligibility.gender;
                if (Array.isArray(gList)) {
                    if (gList.includes("female") && !gList.includes("male") && !gList.includes("any")) {
                        gender = "female";
                    } else if (gList.includes("male") && !gList.includes("female") && !gList.includes("any")) {
                        gender = "male";
                    }
                } else if (typeof gList === "string") {
                    if (gList.toLowerCase().includes("female")) {
                        gender = "female";
                    } else if (gList.toLowerCase().includes("male")) {
                        gender = "male";
                    }
                }
            }

            return {
                name: s.title || s.name || "",
                providerType,
                source,
                categories,
                description: s.description || "",
                eligibility: {
                    minAge: s.eligibility?.age?.[0] || s.eligibility?.minAge || 0,
                    maxAge: s.eligibility?.age?.[1] || s.eligibility?.maxAge || 150,
                    gender,
                    maxIncome: s.eligibility && (s.eligibility.income === 999999 || s.eligibility.income === 9999999 || s.eligibility.income === null) ? null : (s.eligibility?.income || null),
                    occupation,
                    disabilityRequired,
                    maritalStatus: s.eligibility?.maritalStatus || [],
                    states: s.state && s.state !== "All India" ? [s.state] : [],
                    socialCategory
                },
                benefitAmount,
                benefitDescription: s.benefit || "",
                deadline,
                numDocuments: s.documents?.length || 3,
                numSteps: s.benefits?.length || 3,
                documentsRequired: s.documents || [],
                applicationSteps: s.benefits || [],
                applyMode: "online",
                applyUrl: s.applyLink || "#",
                isPrerequisiteFor: []
            };
        } catch (err) {
            console.error(`Error mapping scheme at index ${idx}:`, s);
            throw err;
        }
    });

    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scheme-finder");
    await Scheme.deleteMany({});
    await Scheme.insertMany(mapped);
    console.log(`Seeded ${mapped.length} schemes from mock.js file.`);
    await mongoose.disconnect();
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
