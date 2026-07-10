export const CATEGORIES = [
  { id: 'student', label: 'Students', icon: 'GraduationCap', count: 42, color: 'emerald' },
  { id: 'farmer', label: 'Farmers', icon: 'Wheat', count: 28, color: 'amber' },
  { id: 'employee', label: 'Employees', icon: 'Briefcase', count: 19, color: 'blue' },
  { id: 'women', label: 'Women', icon: 'Heart', count: 34, color: 'rose' },
  { id: 'senior', label: 'Senior Citizens', icon: 'Users', count: 15, color: 'violet' },
  { id: 'entrepreneur', label: 'Entrepreneurs', icon: 'Rocket', count: 22, color: 'orange' },
];

export const SCHEME_TYPES = [
  { id: 'govt', label: 'Government', icon: 'Landmark' },
  { id: 'private', label: 'Private', icon: 'Building2' },
];

export const STATES = [
  'All India', 'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka',
  'Kerala', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export const MINISTRIES = [
  'Ministry of Education', 'Ministry of Agriculture', 'Ministry of Rural Development',
  'Ministry of Women and Child Development', 'Ministry of Skill Development',
  'Ministry of Social Justice', 'Ministry of MSME', 'Ministry of Labour'
];

// "ministry" is used for govt schemes; private schemes use "provider" instead.
export const SCHEMES = [
  {
    id: 'pm-yasasvi',
    title: 'PM YASASVI Scholarship',
    type: 'govt',
    ministry: 'Ministry of Social Justice',
    category: 'student',
    state: 'All India',
    tags: ['Scholarship', 'OBC', 'EBC'],
    benefit: '₹75,000 - ₹1,25,000 / year',
    deadline: '2025-10-31',
    description: 'Pre-matric and post-matric scholarship for OBC, EBC, and DNT students to support quality education from Class 9 to postgraduate level.',
    eligibility: {
      age: [10, 30],
      income: 250000,
      categories: ['OBC', 'EBC', 'DNT'],
      occupation: ['student'],
      gender: ['any'],
    },
    benefits: [
      'Tuition fee reimbursement up to ₹1.25 lakh per year',
      'Academic allowance of ₹3,000 per month',
      'One-time book allowance of ₹5,000',
      'Free hostel accommodation for eligible students'
    ],
    documents: ['Aadhaar Card', 'Income Certificate', 'Caste Certificate', 'Marksheet', 'Bank Passbook'],
    applyLink: 'https://yet.nta.ac.in',
    featured: true,
  },
  {
    id: 'pm-kisan',
    title: 'PM Kisan Samman Nidhi',
    type: 'govt',
    ministry: 'Ministry of Agriculture',
    category: 'farmer',
    state: 'All India',
    tags: ['Direct Benefit', 'Income Support'],
    benefit: '₹6,000 / year',
    deadline: 'Ongoing',
    description: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across the country.',
    eligibility: {
      age: [18, 100],
      income: 999999,
      categories: ['any'],
      occupation: ['farmer'],
      gender: ['any'],
    },
    benefits: [
      '₹2,000 every four months directly to bank account',
      'No paperwork after registration',
      'Covers all landholding farmer families',
      'Additional state-level top-ups in some states'
    ],
    documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Ration Card'],
    applyLink: 'https://pmkisan.gov.in',
    featured: true,
  },
  {
    id: 'nsp-central',
    title: 'Central Sector Scholarship',
    type: 'govt',
    ministry: 'Ministry of Education',
    category: 'student',
    state: 'All India',
    tags: ['Merit', 'Higher Education'],
    benefit: '₹10,000 - ₹20,000 / year',
    deadline: '2025-11-30',
    description: 'Merit-based scholarship for meritorious students from low-income families pursuing higher education in colleges and universities.',
    eligibility: {
      age: [17, 25],
      income: 800000,
      categories: ['any'],
      occupation: ['student'],
      gender: ['any'],
    },
    benefits: [
      '₹10,000 per year for first three years of graduation',
      '₹20,000 per year for post-graduation',
      'Direct bank transfer via DBT',
      'Renewable subject to academic performance'
    ],
    documents: ['Aadhaar Card', 'Income Certificate', '12th Marksheet', 'College Admission Proof', 'Bank Passbook'],
    applyLink: 'https://scholarships.gov.in',
    featured: true,
  },
  {
    id: 'mudra-yojana',
    title: 'Pradhan Mantri MUDRA Yojana',
    type: 'govt',
    ministry: 'Ministry of MSME',
    category: 'entrepreneur',
    state: 'All India',
    tags: ['Loan', 'Business', 'MSME'],
    benefit: 'Loan up to ₹10 lakh',
    deadline: 'Ongoing',
    description: 'Collateral-free loans up to ₹10 lakh for micro and small enterprises through Shishu, Kishore, and Tarun categories.',
    eligibility: {
      age: [18, 65],
      income: 999999,
      categories: ['any'],
      occupation: ['entrepreneur', 'employee'],
      gender: ['any'],
    },
    benefits: [
      'Shishu: Loans up to ₹50,000',
      'Kishore: Loans from ₹50,001 to ₹5 lakh',
      'Tarun: Loans from ₹5 lakh to ₹10 lakh',
      'No collateral required'
    ],
    documents: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Bank Statements', 'Address Proof'],
    applyLink: 'https://mudra.org.in',
    featured: false,
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana',
    type: 'govt',
    ministry: 'Ministry of Women and Child Development',
    category: 'women',
    state: 'All India',
    tags: ['Savings', 'Girl Child'],
    benefit: '8.2% interest rate',
    deadline: 'Ongoing',
    description: 'Small savings scheme for the girl child offering attractive interest rates and tax benefits for parents.',
    eligibility: {
      age: [0, 10],
      income: 999999,
      categories: ['any'],
      occupation: ['any'],
      gender: ['female'],
    },
    benefits: [
      'Attractive 8.2% interest rate (compounded annually)',
      'Tax deduction under Section 80C',
      'Minimum deposit ₹250, maximum ₹1.5 lakh per year',
      'Maturity after 21 years'
    ],
    documents: ['Birth Certificate of Girl Child', 'Aadhaar of Parent', 'Address Proof'],
    applyLink: 'https://www.nsiindia.gov.in',
    featured: true,
  },
  {
    id: 'atal-pension',
    title: 'Atal Pension Yojana',
    type: 'govt',
    ministry: 'Ministry of Labour',
    category: 'senior',
    state: 'All India',
    tags: ['Pension', 'Retirement'],
    benefit: '₹1,000 - ₹5,000 monthly pension',
    deadline: 'Ongoing',
    description: 'Guaranteed monthly pension scheme for citizens in the unorganized sector between 18 and 40 years.',
    eligibility: {
      age: [18, 40],
      income: 999999,
      categories: ['any'],
      occupation: ['any'],
      gender: ['any'],
    },
    benefits: [
      'Guaranteed pension from ₹1,000 to ₹5,000 per month',
      'Government co-contribution for eligible subscribers',
      'Spouse and nominee benefits',
      'Low monthly contribution starting at ₹42'
    ],
    documents: ['Aadhaar Card', 'Bank Account', 'Mobile Number'],
    applyLink: 'https://npscra.nsdl.co.in',
    featured: false,
  },
  {
    id: 'skill-india',
    title: 'PMKVY - Skill India',
    type: 'govt',
    ministry: 'Ministry of Skill Development',
    category: 'employee',
    state: 'All India',
    tags: ['Training', 'Certification', 'Free'],
    benefit: 'Free training + certification',
    deadline: 'Ongoing',
    description: 'Free short-term skill training and certification to help youth become employable and earn a livelihood.',
    eligibility: {
      age: [15, 45],
      income: 999999,
      categories: ['any'],
      occupation: ['employee', 'student'],
      gender: ['any'],
    },
    benefits: [
      'Completely free skill training',
      'Industry-recognized certification',
      'Placement assistance after training',
      'Monetary reward of up to ₹8,000 on successful assessment'
    ],
    documents: ['Aadhaar Card', '10th/12th Marksheet', 'Bank Passbook'],
    applyLink: 'https://pmkvyofficial.org',
    featured: false,
  },
  {
    id: 'kisan-credit',
    title: 'Kisan Credit Card Scheme',
    type: 'govt',
    ministry: 'Ministry of Agriculture',
    category: 'farmer',
    state: 'All India',
    tags: ['Credit', 'Loan', 'Agriculture'],
    benefit: 'Credit up to ₹3 lakh @ 4%',
    deadline: 'Ongoing',
    description: 'Short-term credit for farmers to meet cultivation needs, post-harvest expenses, and allied activities at subsidized interest.',
    eligibility: {
      age: [18, 75],
      income: 999999,
      categories: ['any'],
      occupation: ['farmer'],
      gender: ['any'],
    },
    benefits: [
      'Effective interest rate as low as 4% per annum',
      'Flexible repayment aligned with harvest',
      'Coverage under PMFBY crop insurance',
      'Withdraw via ATM using RuPay card'
    ],
    documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Passport Photo'],
    applyLink: 'https://www.pmkisan.gov.in',
    featured: false,
  },
  {
    id: 'ujjwala',
    title: 'PM Ujjwala Yojana 2.0',
    type: 'govt',
    ministry: 'Ministry of Rural Development',
    category: 'women',
    state: 'All India',
    tags: ['LPG', 'Free Connection'],
    benefit: 'Free LPG connection',
    deadline: 'Ongoing',
    description: 'Free LPG connection to women from below poverty line households to promote clean cooking fuel.',
    eligibility: {
      age: [18, 100],
      income: 100000,
      categories: ['BPL'],
      occupation: ['any'],
      gender: ['female'],
    },
    benefits: [
      'Free deposit-free LPG connection',
      'First refill and stove free',
      'Cash assistance for equipment',
      'Health benefits from clean cooking fuel'
    ],
    documents: ['Aadhaar Card', 'BPL Certificate', 'Ration Card', 'Bank Passbook'],
    applyLink: 'https://www.pmuy.gov.in',
    featured: false,
  },
  {
    id: 'vayoshreshtha',
    title: 'Vayoshreshtha Samman',
    type: 'govt',
    ministry: 'Ministry of Social Justice',
    category: 'senior',
    state: 'All India',
    tags: ['Award', 'Recognition'],
    benefit: 'National recognition + cash',
    deadline: '2025-09-30',
    description: 'National awards for eminent senior citizens and institutions in recognition of their services towards the cause of the elderly.',
    eligibility: {
      age: [60, 120],
      income: 999999,
      categories: ['any'],
      occupation: ['any'],
      gender: ['any'],
    },
    benefits: [
      'National recognition certificate',
      'Cash award of up to ₹1 lakh',
      'Felicitation by President of India',
      'Category-wise awards'
    ],
    documents: ['Aadhaar Card', 'Age Proof', 'Nomination Form', 'Achievement Records'],
    applyLink: 'https://socialjustice.gov.in',
    featured: false,
  },
  {
    id: 'startup-india',
    title: 'Startup India Seed Fund',
    type: 'govt',
    ministry: 'Ministry of MSME',
    category: 'entrepreneur',
    state: 'All India',
    tags: ['Startup', 'Seed Funding'],
    benefit: 'Up to ₹50 lakh funding',
    deadline: 'Ongoing',
    description: 'Financial assistance to startups for proof of concept, prototype development, product trials, and market entry.',
    eligibility: {
      age: [18, 65],
      income: 999999,
      categories: ['any'],
      occupation: ['entrepreneur'],
      gender: ['any'],
    },
    benefits: [
      'Grants up to ₹20 lakh for proof of concept',
      'Convertible debentures up to ₹50 lakh',
      'Mentorship and incubation support',
      'Access to Startup India network'
    ],
    documents: ['DPIIT Recognition', 'PAN Card', 'Incorporation Certificate', 'Pitch Deck'],
    applyLink: 'https://seedfund.startupindia.gov.in',
    featured: false,
  },

  // ---------- Private-sector schemes ----------
  {
    id: 'tata-pankh',
    title: 'Tata Capital Pankh Scholarship',
    type: 'private',
    provider: 'Tata Capital Limited',
    category: 'student',
    state: 'All India',
    tags: ['Scholarship', 'CSR', 'Girl Child'],
    benefit: 'Up to ₹1,00,000 / year',
    deadline: '2025-08-31',
    description: 'CSR-funded scholarship supporting meritorious students from economically weaker sections, with a focus on girl students, for undergraduate studies.',
    eligibility: {
      age: [17, 25],
      income: 400000,
      categories: ['any'],
      occupation: ['student'],
      gender: ['any'],
    },
    benefits: [
      'Tuition support up to ₹1 lakh per year',
      'Mentorship from Tata Capital employees',
      'Priority for first-generation learners',
      'Renewable each academic year on performance'
    ],
    documents: ['Aadhaar Card', 'Income Certificate', 'Marksheet', 'Admission Proof', 'Bank Passbook'],
    applyLink: 'https://www.tatacapital.com/pankh-scholarship.html',
    featured: false,
  },
  {
    id: 'reliance-foundation-scholarship',
    title: 'Reliance Foundation Undergraduate Scholarship',
    type: 'private',
    provider: 'Reliance Foundation',
    category: 'student',
    state: 'All India',
    tags: ['Scholarship', 'Merit'],
    benefit: '₹50,000 one-time',
    deadline: '2025-09-15',
    description: 'One-time merit-cum-means scholarship for students entering the first year of undergraduate study across disciplines.',
    eligibility: {
      age: [17, 22],
      income: 1500000,
      categories: ['any'],
      occupation: ['student'],
      gender: ['any'],
    },
    benefits: [
      'One-time grant of ₹50,000',
      'Networking access to Reliance Foundation alumni community',
      'Certificate of recognition',
      'Priority consideration for internship programs'
    ],
    documents: ['Aadhaar Card', 'Income Proof', '12th Marksheet', 'College Admission Letter'],
    applyLink: 'https://www.reliancefoundation.org/scholarships',
    featured: false,
  },
  {
    id: 'hdfc-parivartan-krishi',
    title: 'HDFC Bank Parivartan Krishi Udaan',
    type: 'private',
    provider: 'HDFC Bank CSR',
    category: 'farmer',
    state: 'All India',
    tags: ['Agri-Training', 'CSR', 'Livelihood'],
    benefit: 'Free agri-inputs + training',
    deadline: 'Ongoing',
    description: 'CSR initiative providing small and marginal farmers with training on modern agricultural practices, quality seeds, and market linkages.',
    eligibility: {
      age: [18, 70],
      income: 999999,
      categories: ['any'],
      occupation: ['farmer'],
      gender: ['any'],
    },
    benefits: [
      'Free training on modern farming techniques',
      'Subsidized access to quality seeds and inputs',
      'Direct market linkage support',
      'Farmer producer organization formation assistance'
    ],
    documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
    applyLink: 'https://www.hdfcbank.com/personal/about-us/csr/parivartan',
    featured: false,
  },
  {
    id: 'infosys-foundation-women',
    title: 'Infosys Foundation Women Entrepreneur Grant',
    type: 'private',
    provider: 'Infosys Foundation',
    category: 'women',
    state: 'All India',
    tags: ['Grant', 'CSR', 'Business'],
    benefit: 'Grant up to ₹2 lakh',
    deadline: '2025-12-15',
    description: 'Seed grants and mentorship for women-led micro and small enterprises in semi-urban and rural areas.',
    eligibility: {
      age: [21, 55],
      income: 600000,
      categories: ['any'],
      occupation: ['entrepreneur'],
      gender: ['female'],
    },
    benefits: [
      'Seed grant of up to ₹2 lakh',
      'Business mentorship for 12 months',
      'Access to Infosys Foundation vendor network',
      'Digital literacy and accounting training'
    ],
    documents: ['Aadhaar Card', 'Business Registration', 'Bank Statements', 'Income Proof'],
    applyLink: 'https://www.infosys.org/infosys-foundation',
    featured: false,
  },
  {
    id: 'lic-jeevan-senior',
    title: 'LIC Saral Pension for Senior Citizens',
    type: 'private',
    provider: 'Life Insurance Corporation of India',
    category: 'senior',
    state: 'All India',
    tags: ['Pension', 'Annuity', 'Insurance'],
    benefit: 'Guaranteed lifelong annuity',
    deadline: 'Ongoing',
    description: 'Single-premium immediate annuity plan offering guaranteed lifelong pension income for senior citizens.',
    eligibility: {
      age: [40, 80],
      income: 999999,
      categories: ['any'],
      occupation: ['any'],
      gender: ['any'],
    },
    benefits: [
      'Guaranteed pension for life',
      'Choice of annuity payout options',
      'Return of purchase price to nominee on death',
      'Loan facility available after 6 months'
    ],
    documents: ['Aadhaar Card', 'Age Proof', 'Bank Passbook', 'PAN Card'],
    applyLink: 'https://licindia.in/web/guest/saral-pension',
    featured: false,
  },
  {
    id: 'nasscom-futureskills',
    title: 'NASSCOM FutureSkills Prime Upskilling',
    type: 'private',
    provider: 'NASSCOM (Industry Consortium)',
    category: 'employee',
    state: 'All India',
    tags: ['Upskilling', 'Tech', 'Certification'],
    benefit: 'Subsidized tech certifications',
    deadline: 'Ongoing',
    description: 'Industry-backed upskilling platform offering courses and certifications in emerging technologies at subsidized rates for IT professionals.',
    eligibility: {
      age: [18, 50],
      income: 999999,
      categories: ['any'],
      occupation: ['employee'],
      gender: ['any'],
    },
    benefits: [
      'Subsidized courses in AI, cloud, and cybersecurity',
      'Industry-recognized certification on completion',
      'Access to potential employer hiring pool',
      'Self-paced online learning modules'
    ],
    documents: ['Aadhaar Card', 'Employment Proof or Resume'],
    applyLink: 'https://futureskillsprime.in',
    featured: false,
  },
  {
    id: 'ab-pmjay',
    title: 'Ayushman Bharat (PM-JAY)',
    ministry: 'Ministry of Health and Family Welfare',
    category: 'employee', // Accessible to unorganized workers/families
    state: 'All India',
    tags: ['Healthcare', 'Insurance', 'Free Medical'],
    benefit: '₹5 Lakh health cover / family / year',
    deadline: 'Ongoing',
    description: 'The world’s largest health insurance scheme providing free secondary and tertiary care hospitalization to vulnerable families.',
    eligibility: {
      age: [0, 100],
      income: 120000,
      categories: ['BPL', 'SC', 'ST'],
      occupation: ['any'],
      gender: ['any'],
    },
    benefits: [
      'Cashless and paperless access to healthcare services',
      'Covers up to 3 days of pre-hospitalization and 15 days post-hospitalization',
      'No restriction on family size, age, or gender',
      'All pre-existing conditions are covered from day one'
    ],
    documents: ['Aadhaar Card', 'Ration Card (PM-JAY Letter)', 'Income Certificate'],
    applyLink: 'https://pmjay.gov.in',
    featured: true,
  },
  {
    id: 'pmsvanidhi',
    title: 'PM SVANidhi Scheme',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'entrepreneur',
    state: 'All India',
    tags: ['Loan', 'Street Vendor', 'Micro-credit'],
    benefit: 'Working capital loan up to ₹50,000',
    deadline: 'Ongoing',
    description: 'A special micro-credit facility scheme for providing affordable working capital loans to street vendors to resume their livelihoods.',
    eligibility: {
      age: [18, 65],
      income: 999999,
      categories: ['any'],
      occupation: ['entrepreneur'],
      gender: ['any'],
    },
    benefits: [
      'Initial working capital loan of up to ₹10,000',
      '7% interest subsidy on timely/early repayment',
      'Cashback incentives up to ₹1,200 per year on digital transactions',
      'Eligibility for enhanced next-cycle loan of ₹20,000 and ₹50,000'
    ],
    documents: ['Aadhaar Card', 'Voter ID Card', 'Certificate of Vending (COV)'],
    applyLink: 'https://pmsvanidhi.mohua.gov.in',
    featured: false,
  },
  {
    id: 'pmsby',
    title: 'PM Suraksha Bima Yojana',
    ministry: 'Ministry of Finance',
    category: 'employee',
    state: 'All India',
    tags: ['Insurance', 'Accident Cover'],
    benefit: '₹2 Lakh accident insurance',
    deadline: 'Ongoing',
    description: 'An affordable, government-backed accident insurance scheme for citizens with auto-debit facility from bank accounts.',
    eligibility: {
      age: [18, 70],
      income: 999999,
      categories: ['any'],
      occupation: ['any'],
      gender: ['any'],
    },
    benefits: [
      '₹2 Lakh coverage for accidental death or total permanent disability',
      '₹1 Lakh coverage for partial permanent disability',
      'Extremely low premium of just ₹20 per annum',
      'Seamless auto-debit renewal process'
    ],
    documents: ['Aadhaar Card', 'Bank Passbook', 'Nominee Details'],
    applyLink: 'https://jansuraksha.gov.in',
    featured: false,
  },
  {
    id: 'pmmvy',
    title: 'Pradhan Mantri Matru Vandana Yojana',
    ministry: 'Ministry of Women and Child Development',
    category: 'women',
    state: 'All India',
    tags: ['Maternity Benefit', 'Direct Benefit'],
    benefit: '₹5,000 cash incentive',
    deadline: 'Ongoing',
    description: 'A maternity benefit program providing direct cash incentives to pregnant and lactating mothers for the first living child.',
    eligibility: {
      age: [19, 45],
      income: 999999,
      categories: ['any'],
      occupation: ['any'],
      gender: ['female'],
    },
    benefits: [
      'Cash incentives paid directly to bank accounts via DBT',
      'Promotes safe delivery and optimal infant feeding practices',
      'Compensation for wage loss during childbirth',
      'Linked to routine immunization cycles'
    ],
    documents: ['Aadhaar Card', 'MCP Card (Mother and Child Protection)', 'Bank Passbook'],
    applyLink: 'https://pmmvy.wcd.gov.in',
    featured: false,
  },
  {
    id: 'pm-shram-yogi',
    title: 'PM Shram Yogi Maan-dhan',
    ministry: 'Ministry of Labour',
    category: 'senior',
    state: 'All India',
    tags: ['Pension', 'Unorganized Sector'],
    benefit: '₹3,000 guaranteed monthly pension',
    deadline: 'Ongoing',
    description: 'A voluntary and contributory pension scheme for unorganized workers like street vendors, rickshaw pullers, and domestic helpers.',
    eligibility: {
      age: [18, 40],
      income: 180000,
      categories: ['any'],
      occupation: ['employee'],
      gender: ['any'],
    },
    benefits: [
      'Assured monthly pension of ₹3,000 after reaching age 60',
      'Matching 50:50 contribution by the Central Government',
      'Family pension of 50% to spouse in case of death',
      'Easy exit plans with accumulated interest auto-credited'
    ],
    documents: ['Aadhaar Card', 'Savings Bank Account Account / Jan Dhan Account'],
    applyLink: 'https://maandhan.in',
    featured: false,
  },
  {
    id: 'reliance-dhubhai',
    title: 'Reliance Foundation Scholarship',
    ministry: 'Private: Reliance Foundation',
    category: 'student',
    state: 'All India',
    tags: ['Private', 'Scholarship', 'Undergraduate'],
    benefit: 'Up to ₹2,00000 - ₹6,00000 / degree',
    deadline: '2025-10-15',
    description: 'Private merit-cum-means scholarship supporting meritorious Indian students pursuing full-time undergraduate or postgraduate degrees.',
    eligibility: {
      age: [17, 25],
      income: 1500000,
      categories: ['any'],
      occupation: ['student'],
      gender: ['any'],
    },
    benefits: [
      'Financial support up to ₹2 Lakh for UG and ₹6 Lakh for PG',
      'Access to an active global alumni network',
      'Exclusive leadership and professional development workshops',
      'Internship opportunities within partner ecosystems'
    ],
    documents: ['Aadhaar Card', '12th/Graduation Marksheet', 'Income Certificate', 'Current College Admission Proof'],
    applyLink: 'https://www.scholarships.reliancefoundation.org',
    featured: true,
  },
  {
    id: 'hdfc-badhte-kadam',
    title: 'HDFC Bank Parivartan Scholarship',
    ministry: 'Private: HDFC Bank',
    category: 'student',
    state: 'All India',
    tags: ['Private', 'Scholarship', 'School & College'],
    benefit: '₹15,000 - ₹75,000 / year',
    deadline: '2025-09-30',
    description: 'A CSR initiative by HDFC Bank aiming to assist smart students facing financial hardships or family crises to continue their education.',
    eligibility: {
      age: [6, 26],
      income: 600000,
      categories: ['any'],
      occupation: ['student'],
      gender: ['any'],
    },
    benefits: [
      'School students (Class 1-12) receive up to ₹15,000',
      'Diploma and undergraduate students receive up to ₹30,000',
      'Professional courses (B.Tech/MBBS/MBA) receive up to ₹75,000',
      'Special preference given to students facing sudden parental job loss or health crises'
    ],
    documents: ['Previous Academic Marksheet', 'Family Income Certificate', 'Identity Proof', 'Crisis Proof (if applicable)'],
    applyLink: 'https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-scholarship',
    featured: false,
  },
  {
    id: 'tata-samarth',
    title: 'Tata Samarth Scheme',
    ministry: 'Private: Tata Motors',
    category: 'farmer',
    state: 'All India',
    tags: ['Private', 'Welfare', 'Commercial Driver'],
    benefit: 'Scholarship + ₹10 Lakh Life Cover',
    deadline: 'Ongoing',
    description: 'A dedicated welfare initiative designed to provide financial, health, and academic security to commercial vehicle drivers and owner-drivers.',
    eligibility: {
      age: [18, 60],
      income: 500000,
      categories: ['any'],
      occupation: ['farmer', 'employee'],
      gender: ['any'],
    },
    benefits: [
      '₹10 Lakh accidental death & permanent disability insurance cover',
      'Health insurance up to ₹1 Lakh for family treatments',
      'Higher education scholarships for drivers’ children',
      'Financial support for daughters’ weddings'
    ],
    documents: ['Commercial Driving License', 'Aadhaar Card', 'Vehicle Ownership Papers / Employment Proof'],
    applyLink: 'https://www.tatamotors.com',
    featured: false,
  },
  {
    id: 'infosys-foundation-aarohan',
    title: 'Infosys Aarohan Social Innovation Awards',
    ministry: 'Private: Infosys Foundation',
    category: 'entrepreneur',
    state: 'All India',
    tags: ['Private', 'Innovation', 'Cash Prize'],
    benefit: 'Cash prize up to ₹20 Lakh',
    deadline: '2025-12-15',
    description: 'Awards created to recognize, celebrate, and support grassroot innovations that offer realistic solutions for social welfare.',
    eligibility: {
      age: [18, 75],
      income: 999999,
      categories: ['any'],
      occupation: ['entrepreneur'],
      gender: ['any'],
    },
    benefits: [
      'Top innovators receive mega cash rewards up to ₹20 Lakh',
      'Opportunity for product incubation and mentorship by industry leaders',
      'Travel and exhibition grants to display work globally',
      'IP/Patent filing advisory support'
    ],
    documents: ['Project Prototype Report', 'PAN Card', 'Video Demonstration / Pitch Deck'],
    applyLink: 'https://www.infosys.com/infosys-foundation/aarohan-awards.html',
    featured: true,
  },
  {
    id: 'loreal-women-science',
    title: 'L’Oréal India For Young Women in Science',
    ministry: 'Private: L’Oréal India',
    category: 'women',
    state: 'All India',
    tags: ['Private', 'Scholarship', 'STEM'],
    benefit: '₹2,50,000 / student',
    deadline: '2025-10-15',
    description: 'Financial aid provided to young women who have passed Class 12 and wish to pursue a graduation degree in any scientific field (STEM).',
    eligibility: {
      age: [16, 19],
      income: 600000,
      categories: ['any'],
      occupation: ['student'],
      gender: ['female'],
    },
    benefits: [
      'Total scholarship of ₹2.5 Lakh distributed over college years',
      'Covers tuition fees, books, and educational materials',
      'One-on-one mentorship sessions with female scientists',
      'Invitations to research symposia and technical networking meetups'
    ],
    documents: ['Class 10 and 12 Marksheets (Minimum 85% in PCM/PCB)', 'Income Proof', 'Aadhaar Card', 'College Admission Letter'],
    applyLink: 'https://www.foryoungwomeninscience.co.in',
    featured: false,
  }
];

export const STATS = [
  { label: 'Active Schemes', value: '160+', icon: 'Layers' },
  { label: 'Beneficiaries', value: '2.4Cr', icon: 'Users' },
  { label: 'States Covered', value: '28+', icon: 'MapPin' },
  { label: 'Categories', value: '6', icon: 'LayoutGrid' },
];

export const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Postgraduate Student, Delhi',
    text: 'Found three scholarships in five minutes. The eligibility checker saved me weeks of research.',
    initials: 'PS',
  },
  {
    name: 'Ramesh Yadav',
    role: 'Farmer, Uttar Pradesh',
    text: 'Applied for PM Kisan and got the benefits within a month. The instructions were very clear.',
    initials: 'RY',
  },
  {
    name: 'Anita Devi',
    role: 'Entrepreneur, Bihar',
    text: 'MUDRA loan helped me start my tailoring unit. Now I employ 8 women from my village.',
    initials: 'AD',
  },
];

export const HOW_IT_WORKS = [
  { step: '01', title: 'Answer a few questions', desc: 'Tell us about yourself — age, occupation, income and state. Takes under 2 minutes.' },
  { step: '02', title: 'Get personalized matches', desc: 'Our engine ranks schemes you are eligible for based on your profile.' },
  { step: '03', title: 'Apply with confidence', desc: 'Follow step-by-step application instructions on the official portal.' },
];

// Local storage helpers for mock user state
export const getSavedSchemes = () => {
  try {
    return JSON.parse(localStorage.getItem('savedSchemes') || '[]');
  } catch {
    return [];
  }
};

export const toggleSavedScheme = (id) => {
  const list = getSavedSchemes();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  localStorage.setItem('savedSchemes', JSON.stringify(next));
  return next;
};

export const getProfile = () => {
  try {
    return JSON.parse(localStorage.getItem('userProfile') || 'null');
  } catch {
    return null;
  }
};

export const setProfile = (profile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};