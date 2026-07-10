export const CATEGORIES = [
  { id: 'student', label: 'Students', icon: 'GraduationCap', count: 42, color: 'emerald' },
  { id: 'farmer', label: 'Farmers', icon: 'Wheat', count: 28, color: 'amber' },
  { id: 'employee', label: 'Employees', icon: 'Briefcase', count: 19, color: 'blue' },
  { id: 'women', label: 'Women', icon: 'Heart', count: 34, color: 'rose' },
  { id: 'senior', label: 'Senior Citizens', icon: 'Users', count: 15, color: 'violet' },
  { id: 'entrepreneur', label: 'Entrepreneurs', icon: 'Rocket', count: 22, color: 'orange' },
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

export const SCHEMES = [
  {
    id: 'pm-yasasvi',
    title: 'PM YASASVI Scholarship',
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