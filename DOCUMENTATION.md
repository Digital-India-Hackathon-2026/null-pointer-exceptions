# BenefitBridge — Full Functional Documentation & Architecture

Welcome to **BenefitBridge**, a premium, AI-assisted portal designed to discover, track, and review government and private sector benefit schemes and scholarships across India. 

This document provides a comprehensive overview of the architecture, features, algorithms, data coverage, and functional systems implemented within BenefitBridge.

---

## 📅 System Overview & Features

### 1. Unified Eligibility Checker & Profile Hub
* **Multi-Profile Management**: Users can manage their own profile ("Self") as well as profiles for family members, friends, or neighbors ("Dependents") without mixing their details.
* **Fuzzy Input Handling**: Support for "Not Sure / Unknown" values on income and disability, ensuring users are never blocked by missing details.
* **Thematic Matching Pages**: Results are arranged in high-contrast thematic card grids tailored for specific groups (Farmers, Widows, Persons with Disabilities, and General).

### 2. Multi-Tier Ranking Engine (Rule-based)
BenefitBridge uses a deterministic rule-based ranking engine that prevents LLM hallucinations.
* **Confirmed** vs **Possible** classification: If a user selects "Not Sure" for a field required by a scheme, the engine marks the result as a "Possible Match" rather than hiding it.
* **Priority Score Matrix**: Calculates eligibility strength using age proximities, income margins, and social categories.

### 3. Dynamic Deadlines Tracking Calendar
* **Visual Status Grid**: An interactive monthly calendar mapping active scheme deadlines.
* **Dynamic Warning Badges**: 
  - ⚠️ **Closing Soon**: Highlights in gold/amber color with animated pulses for deadlines within 30 days of the current date.
  - 🔴 **Expired**: Highlights in red for deadlines already in the past.
  - 🟢 **Active**: Highlights in emerald/green for standard future deadlines.

### 4. Interactive Rating & Review System
* **Disbursement Risk Warnings**: Users can write reviews and flag if a scheme is 👍 *Highly Reliable/Very Useful* or ⚠️ *Delayed Funds/Processing Risk*.
* **Highlighting**: Scheme cards get dynamic green/red outlines based on user reviews, cautioning other applicants before they invest application efforts.
* **"Highly Recommended" Dropdown**: A homepage hero selection box that aggregates all positively-rated schemes, allowing single-click access for high-success programs.

### 5. Multilingual Localizaton (India-Focus)
A translation context translates all labels, headers, and inputs into local languages:
* **English** (`en`)
* **Hindi** (`hi`) — हिंदी
* **Bengali** (`bn`) — বাংলা
* **Marathi** (`mr`) — मराठी
* **Telugu** (`te`) — తెలుగు
* **Tamil** (`ta`) — தமிழ்

---

## 🗃 Backend Database & Models (Mongoose)

### Scheme Schema
```javascript
const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  providerType: { type: String, enum: ["government", "private"], required: true },
  source: { type: String, required: true },
  categories: [{ type: String }],
  description: { type: String },
  eligibility: {
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 150 },
    gender: { type: String, enum: ["male", "female", "any"], default: "any" },
    maxIncome: { type: Number, default: null },
    occupation: [{ type: String }],
    disabilityRequired: { type: Boolean, default: false },
    maritalStatus: [{ type: String }],
    states: [{ type: String }],
    socialCategory: [{ type: String }]
  },
  benefitAmount: { type: Number, default: 0 },
  benefitDescription: { type: String },
  deadline: { type: Date, default: null },
  numDocuments: { type: Number, default: 3 },
  numSteps: { type: Number, default: 3 },
  documentsRequired: [{ type: String }],
  applicationSteps: [{ type: String }],
  applyMode: { type: String, enum: ["online", "offline", "both"], default: "online" },
  applyUrl: { type: String },
  isPrerequisiteFor: [{ type: String }]
});
```

---

## 📊 Catalog Coverage: 50 Schemes & Scholarships

The catalog consists of **50 distinct entries** covering national (All India) programs and targeted state-level schemes across key regions for a complete representation:

### 1. Education & Student Scholarships (12 Programmes)
* **PM YASASVI Scholarship**: Focuses on OBC, EBC, and DNT students.
* **National Scholarship Portal (NSP) Central Sector Plan**: Merit-based collegiate support.
* **Tata Capital Pankh Scholarship**: Private aid optimized for girl students in professional graduation.
* **Reliance Foundation Undergraduate Grant**: Merit-cum-means scholarship for first-year degree students.
* **Infosys Foundation Aarohan Awards**: Innovation prizes up to ₹20,00,000 for grassroots tech builders.
* **L’Oréal India For Young Women in Science Program**: Up to ₹2.5 Lakh for girls in science streams (PCM/PCB).
* **State-level Higher Education Scholarships** (across Tamil Nadu, Telangana, Gujarat, Bengal, Bihar): Subsidized fee waivers and book allowances.

### 2. Agriculture & Farmer Subsidies (10 Programmes)
* **PM-KISAN Samman Nidhi**: Direct financial aid of ₹6,000/year to landholding farmers.
* **PM Fasal Bima Yojana (PMFBY)**: Subsidized crop insurance cover against failure.
* **Kisan Credit Card (KCC) Scheme**: Low-interest short term credit (4% rate) for inputs.
* **HDFC Bank Parivartan Krishi Udaan**: Private support providing organic farming machinery, training, and direct market linkage.
* **State-level Krishi Samridhi Subsidies** (across Karnataka, Maharashtra, Gujarat, UP, Punjab): Solar pump installations, tractor offsets, and crop loans.

### 3. Business & Entrepreneurship Credit (10 Programmes)
* **Pradhan Mantri MUDRA Yojana**: Collateral-free credit up to ₹10 Lakh (Shishu, Kishore, Tarun tiers).
* **Startup India Seed Fund**: Investment ranging from ₹20 Lakh to ₹50 Lakh for proof-of-concept.
* **PM SVANidhi Scheme**: Affordable working capital loan for street food vendors with digital cashback rewards.
* **HDFC Parivartan Women Entrepreneur Loan**: Low-cost loans up to ₹5,00,000 for women-led startups.
* **State-level Youth Entrepreneurship Loan Programs** (across Delhi, Telangana, Maharashtra): Seed funds for business ideation.

### 4. Healthcare & Disability Aid (8 Programmes)
* **Ayushman Bharat PM-JAY**: Global-largest health cover (₹5 Lakh family cover per year) for BPL/SC/ST.
* **Deendayal Disabled Rehabilitation Scheme**: Rehabilitation, orthotics aid, and education.
* **National Handicapped Finance & Development Corp Loan**: Low-interest self-reliance business credit for PW/Disability.
* **Infosys Foundation Disability Grant**: Private assistance providing clean medical support, wheelchairs, and grants direct-to-hospital.
* **State-level Labours Medical Cooperatives** (across Punjab, Bengal, UP, Tamil Nadu): Relief and maternity cash incentives.

### 5. Women & Social Safeguards (10 Programmes)
* **Sukanya Samriddhi Yojana (SSY)**: high-yield safe savings account for girl children.
* **Pradhan Mantri Ujjwala Yojana 2.0**: Free gas connection, stove, and cylinder to BPL women.
* **Pradhan Mantri Matru Vandana Yojana (PMMVY)**: Maternity DBT support of ₹5,000.
* **Atal Pension Yojana (APY)**: Unorganized sector pensions ranging from ₹1,000 to ₹5,000/month.
* **State-level Vulnerable Widow Self-Reliance Grants**: DBT setup aid (₹50,000) for running micro-boutiques or livestock.

---

## 🛠 Troubleshooting & Bugfixes Summary

1. **Vite Dynamic Icon Import Fix**:
   - Fixed mapping issue in `DeadlineCalendar.jsx` where standard icons `LuAlertTriangle` and `LuCheckCircle` were not found.
   - Updated them to modern valid exports: `LuTriangleAlert` and `LuCircleCheck`.
2. **Dynamic Database Mappings**:
   - Resolved critical page load error in `Profile.jsx` where saved schemes loaded from the backend Mongoose models lacked the `deadline` property.
   - Included explicit `deadline: s.deadline || 'Ongoing'` in the Mongoose payload mapping loop.
3. **Database Seed Re-Syncing**:
   - Resolved a matching error where custom target dates did not apply to actual DB entities. Reseeded all 50 items with matching dates and attributes.
