const mongoose = require("mongoose");

const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  providerType: { type: String, enum: ["government", "private"], required: true },
  source: { type: String, required: true }, // e.g. "Ministry of Agriculture", "Tata Trusts"
  categories: [{ type: String }], // e.g. ["farmer", "low-income", "disabled", "woman"]
  description: { type: String },

  eligibility: {
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 150 },
    gender: { type: String, enum: ["male", "female", "any"], default: "any" },
    maxIncome: { type: Number, default: null }, // null = no income cap
    occupation: [{ type: String }], // e.g. ["farmer"], [] = any
    disabilityRequired: { type: Boolean, default: false },
    maritalStatus: [{ type: String }], // e.g. ["widow"], [] = any
    states: [{ type: String }], // [] = all-India
    socialCategory: [{ type: String }] // e.g. ["SC","ST"], [] = any
  },

  benefitAmount: { type: Number, default: 0 }, // in INR, 0 if non-monetary
  benefitDescription: { type: String },

  deadline: { type: Date, default: null }, // null = rolling/no deadline
  numDocuments: { type: Number, default: 3 },
  numSteps: { type: Number, default: 3 },
  documentsRequired: [{ type: String }],
  applicationSteps: [{ type: String }],
  applyMode: { type: String, enum: ["online", "offline", "both"], default: "online" },
  applyUrl: { type: String },

  isPrerequisiteFor: [{ type: String }] // names of other schemes this unlocks
});

module.exports = mongoose.model("Scheme", SchemeSchema);
