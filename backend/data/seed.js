const mongoose = require("mongoose");
require("dotenv").config();
const Scheme = require("../models/Scheme");

const schemes = [
  {
    name: "PM-KISAN Samman Nidhi",
    providerType: "government",
    source: "Ministry of Agriculture & Farmers Welfare",
    categories: ["farmer", "low-income"],
    description: "Income support of ₹6,000/year to landholding farmer families.",
    eligibility: { minAge: 18, maxAge: 150, gender: "any", maxIncome: null, occupation: ["farmer"], disabilityRequired: false, maritalStatus: [], states: [], socialCategory: [] },
    benefitAmount: 6000,
    benefitDescription: "₹6,000 per year in 3 installments",
    deadline: null,
    numDocuments: 3,
    numSteps: 2,
    documentsRequired: ["Aadhaar Card", "Land Records / Khatauni", "Bank Passbook"],
    applicationSteps: ["Visit pmkisan.gov.in and click New Farmer Registration", "Enter Aadhaar and land record details", "Upload documents and submit", "Track status using registration number"],
    applyMode: "online",
    applyUrl: "https://pmkisan.gov.in",
    isPrerequisiteFor: []
  },
  {
    name: "Deendayal Disabled Rehabilitation Scheme",
    providerType: "government",
    source: "Ministry of Social Justice & Empowerment",
    categories: ["disabled", "low-income"],
    description: "Financial assistance and rehabilitation support for persons with disabilities.",
    eligibility: { minAge: 0, maxAge: 150, gender: "any", maxIncome: 250000, occupation: [], disabilityRequired: true, maritalStatus: [], states: [], socialCategory: [] },
    benefitAmount: 25000,
    benefitDescription: "Up to ₹25,000 assistance + rehabilitation aids",
    deadline: "2026-09-30",
    numDocuments: 4,
    numSteps: 3,
    documentsRequired: ["Disability Certificate (UDID)", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
    applicationSteps: ["Get UDID disability certificate if not already issued", "Fill application at nearest District Disability Office", "Submit documents for verification", "Receive assistance after approval"],
    applyMode: "both",
    applyUrl: "https://disabilityaffairs.gov.in",
    isPrerequisiteFor: []
  },
  {
    name: "Pradhan Mantri Vidya Laxmi (Widow Support)",
    providerType: "government",
    source: "Ministry of Women & Child Development",
    categories: ["widow", "low-income", "woman"],
    description: "Financial support scheme for widows below poverty line.",
    eligibility: { minAge: 18, maxAge: 150, gender: "female", maxIncome: 200000, occupation: [], disabilityRequired: false, maritalStatus: ["widow"], states: [], socialCategory: [] },
    benefitAmount: 30000,
    benefitDescription: "₹30,000 one-time + monthly pension eligibility",
    deadline: "2026-08-15",
    numDocuments: 5,
    numSteps: 4,
    documentsRequired: ["Husband's Death Certificate", "Income Certificate", "Aadhaar Card", "Bank Passbook", "BPL Card (if available)"],
    applicationSteps: ["Collect death certificate and income proof", "Visit local Women & Child Development office", "Submit filled application with documents", "Verification visit by field officer", "Approval and first disbursement"],
    applyMode: "offline",
    applyUrl: "https://wcd.gov.in",
    isPrerequisiteFor: ["Widow Pension Scheme (National Social Assistance)"]
  },
  {
    name: "Widow Pension Scheme (National Social Assistance)",
    providerType: "government",
    source: "Ministry of Rural Development",
    categories: ["widow", "low-income"],
    description: "Monthly pension for widows from BPL households.",
    eligibility: { minAge: 40, maxAge: 150, gender: "female", maxIncome: 150000, occupation: [], disabilityRequired: false, maritalStatus: ["widow"], states: [], socialCategory: [] },
    benefitAmount: 15000,
    benefitDescription: "₹1,250/month pension (annualized)",
    deadline: null,
    numDocuments: 3,
    numSteps: 2,
    documentsRequired: ["Aadhaar Card", "BPL Certificate", "Bank Passbook"],
    applicationSteps: ["Apply online at nsap.nic.in", "Upload documents", "Track approval status online"],
    applyMode: "online",
    applyUrl: "https://nsap.nic.in",
    isPrerequisiteFor: []
  },
  {
    name: "Tata Trusts Education Grant",
    providerType: "private",
    source: "Tata Trusts",
    categories: ["low-income", "student"],
    description: "Grants for higher education for economically disadvantaged students.",
    eligibility: { minAge: 17, maxAge: 30, gender: "any", maxIncome: 300000, occupation: [], disabilityRequired: false, maritalStatus: [], states: [], socialCategory: [] },
    benefitAmount: 100000,
    benefitDescription: "Up to ₹1,00,000 towards tuition",
    deadline: "2026-07-31",
    numDocuments: 4,
    numSteps: 3,
    documentsRequired: ["Admission Letter", "Income Certificate", "Aadhaar Card", "Academic Marksheets"],
    applicationSteps: ["Register on Tata Trusts portal", "Fill grant application with academic details", "Upload documents", "Await selection committee decision"],
    applyMode: "online",
    applyUrl: "https://www.tatatrusts.org",
    isPrerequisiteFor: []
  },
  {
    name: "HDFC Parivartan Women Entrepreneur Loan",
    providerType: "private",
    source: "HDFC Bank",
    categories: ["woman", "entrepreneur"],
    description: "Subsidized-interest business loans for women entrepreneurs.",
    eligibility: { minAge: 21, maxAge: 60, gender: "female", maxIncome: null, occupation: ["business", "entrepreneur"], disabilityRequired: false, maritalStatus: [], states: [], socialCategory: [] },
    benefitAmount: 500000,
    benefitDescription: "Loan up to ₹5,00,000 at subsidized interest",
    deadline: null,
    numDocuments: 6,
    numSteps: 5,
    documentsRequired: ["Business Plan", "Aadhaar & PAN", "Bank Statements (6 months)", "Address Proof", "Photographs", "Existing loan statements (if any)"],
    applicationSteps: ["Visit nearest HDFC branch or apply online", "Submit business plan and KYC documents", "Credit assessment by bank", "Loan sanction letter issued", "Disbursement to business account"],
    applyMode: "both",
    applyUrl: "https://www.hdfcbank.com",
    isPrerequisiteFor: []
  },
  {
    name: "Ayushman Bharat PM-JAY",
    providerType: "government",
    source: "Ministry of Health & Family Welfare",
    categories: ["low-income", "health"],
    description: "Health insurance cover up to ₹5 lakh per family per year.",
    eligibility: { minAge: 0, maxAge: 150, gender: "any", maxIncome: 250000, occupation: [], disabilityRequired: false, maritalStatus: [], states: [], socialCategory: [] },
    benefitAmount: 500000,
    benefitDescription: "₹5,00,000 health cover per family/year",
    deadline: null,
    numDocuments: 2,
    numSteps: 2,
    documentsRequired: ["Aadhaar Card", "Ration Card / Family ID"],
    applicationSteps: ["Check eligibility at pmjay.gov.in", "Visit nearest empanelled hospital or CSC to get Ayushman Card issued"],
    applyMode: "online",
    applyUrl: "https://pmjay.gov.in",
    isPrerequisiteFor: []
  },
  {
    name: "Infosys Foundation Disability Support Grant",
    providerType: "private",
    source: "Infosys Foundation",
    categories: ["disabled", "low-income"],
    description: "Assistive devices and support grants for persons with disabilities.",
    eligibility: { minAge: 5, maxAge: 150, gender: "any", maxIncome: 400000, occupation: [], disabilityRequired: true, maritalStatus: [], states: [], socialCategory: [] },
    benefitAmount: 40000,
    benefitDescription: "Up to ₹40,000 for assistive devices",
    deadline: "2026-10-01",
    numDocuments: 3,
    numSteps: 2,
    documentsRequired: ["Disability Certificate", "Income Proof", "Aadhaar Card"],
    applicationSteps: ["Apply through Infosys Foundation website", "Submit disability and income documents", "Await grant approval and device dispatch"],
    applyMode: "online",
    applyUrl: "https://www.infosys.org",
    isPrerequisiteFor: []
  },
  {
    name: "PM Fasal Bima Yojana (Crop Insurance)",
    providerType: "government",
    source: "Ministry of Agriculture & Farmers Welfare",
    categories: ["farmer"],
    description: "Crop insurance scheme protecting farmers against crop loss.",
    eligibility: { minAge: 18, maxAge: 150, gender: "any", maxIncome: null, occupation: ["farmer"], disabilityRequired: false, maritalStatus: [], states: [], socialCategory: [] },
    benefitAmount: 200000,
    benefitDescription: "Compensation up to ₹2,00,000 depending on crop/loss",
    deadline: "2026-08-01",
    numDocuments: 4,
    numSteps: 3,
    documentsRequired: ["Aadhaar Card", "Land Records", "Bank Passbook", "Sowing Certificate"],
    applicationSteps: ["Apply online at pmfby.gov.in or via bank/CSC", "Pay nominal premium share", "Get insurance policy confirmation", "File claim after crop loss if applicable"],
    applyMode: "online",
    applyUrl: "https://pmfby.gov.in",
    isPrerequisiteFor: []
  },
  {
    name: "National Handicapped Finance & Development Corp Loan",
    providerType: "government",
    source: "Ministry of Social Justice & Empowerment",
    categories: ["disabled", "entrepreneur", "low-income"],
    description: "Low-interest loans for persons with disabilities to start businesses.",
    eligibility: { minAge: 18, maxAge: 150, gender: "any", maxIncome: 300000, occupation: [], disabilityRequired: true, maritalStatus: [], states: [], socialCategory: [] },
    benefitAmount: 300000,
    benefitDescription: "Loan up to ₹3,00,000 at low interest",
    deadline: null,
    numDocuments: 5,
    numSteps: 4,
    documentsRequired: ["Disability Certificate", "Business Plan", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
    applicationSteps: ["Apply through State Channelizing Agency", "Submit business plan and disability certificate", "Loan appraisal and interview", "Sanction and disbursement"],
    applyMode: "offline",
    applyUrl: "https://nhfdc.nic.in",
    isPrerequisiteFor: []
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scheme-finder");
  await Scheme.deleteMany({});
  await Scheme.insertMany(schemes);
  console.log(`Seeded ${schemes.length} schemes.`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
