
export interface Topic {
  title: string;
  subTopics: string[];
}

export interface SyllabusSection {
  title: string;
  topics: Topic[];
}

export const SYLLABUS: SyllabusSection[] = [
  {
    title: "General Knowledge with special reference to J&K UT",
    topics: [
      { title: "Current Events", subTopics: ["National Importance", "International Importance"] },
      { title: "Geography of India & World", subTopics: ["Political Divisions of India", "Physical Divisions of India", "World Political & Physical Divisions"] },
      { title: "Indian History & Culture", subTopics: ["Indian Culture & Heritage", "Indian Freedom Struggle/Movement"] },
      { title: "Infrastructure", subTopics: ["Major Indian Transport Networks", "Major Indian Communication Networks"] },
      { title: "Demography", subTopics: ["Census of India - Features & Functions", "Key Census Statistics"] },
      { title: "Indian Geography", subTopics: ["Important Rivers & Lakes in India", "Weather, Climate, Crops in India", "Soils in India"] },
      { title: "Environment", subTopics: ["Environment & Ecology Concepts", "Bio-diversity & Conventions"] },
      { title: "History of J&K", subTopics: ["Dogra Rule", "Post-1947 History"] },
      { title: "Economy of J&K UT", subTopics: ["Primary Sector", "Secondary Sector", "Tertiary Sector"] },
      { title: "Geography of J&K UT", subTopics: ["Major Physical Features", "Climate and Resources"] },
      { title: "Heritage & Culture of J&K UT", subTopics: ["Folk Music and Dance", "Festivals and Traditions"] },
      { title: "Tourism in J&K", subTopics: ["Important Tourist Destinations"] },
      { title: "J&K Reorganization", subTopics: ["Jammu & Kashmir Reorganization Act, 2019 - Key Provisions"] },
    ],
  },
  {
    title: "Accountancy and Book Keeping",
    topics: [
      { title: "Introduction to Financial Accounting", subTopics: ["Objectives", "Advantages", "Limitations"] },
      { title: "Basic Accounting Terms", subTopics: ["Asset", "Liability", "Capital", "Expense", "Income"] },
      { title: "Accounting Principles", subTopics: ["Accounting Concepts", "Accounting Conventions", "Generally Accepted Accounting Principles (GAAP)"] },
      { title: "Core Accounting", subTopics: ["The Accounting Equation", "Journal Entries", "Ledger Posting", "Concept of Debit and Credit"] },
      { title: "Specialized Topics", subTopics: ["Voucher Approach in Accounting", "Bank Reconciliation Statement", "Distinction between Capital and Revenue"] },
      { title: "Financial Statements", subTopics: ["Preparation of Trading Account", "Preparation of Profit & Loss Account", "Preparation of Balance Sheet"] },
      { title: "Partnership Accounts", subTopics: ["Admission of a Partner", "Retirement & Death of a Partner", "Dissolution of Partnership Firms"] },
      { title: "Book Keeping", subTopics: ["Cash Book - Single, Double, Triple Column", "Principles of Double Entry", "Preparation of Trial Balance"] },
      { title: "Audit and Social Accounting", subTopics: ["Introduction to Financial Audit", "Concept of Social Accounting & Social Audit"] },
      { title: "Other Systems", subTopics: ["Cash based single entry system", "Public Financial Management System (PFMS)"] },
    ],
  },
  {
    title: "General English",
    topics: [
      { title: "Grammar Fundamentals", subTopics: ["Tenses and their sub-types", "Sentence Structure", "Rearranging of jumbled sentences"] },
      { title: "Speech and Voice", subTopics: ["Narration - Direct and Indirect Speech", "Models - Can, Could, May, etc."] },
      { title: "Articles and Pronouns", subTopics: ["Definite (The) and Indefinite (A, An) Articles", "Types and usage of Pronouns"] },
      { title: "Vocabulary", subTopics: ["Synonyms and Antonyms", "Homonyms / homophones", "Idioms and Phrases", "Pairs of words"] },
      { title: "Sentence Structure", subTopics: ["Clauses - Noun, Adjective, Adverb", "Uses of Prepositions"] },
      { title: "Reading Skills", subTopics: ["Reading Comprehension with questions", "Fill in the blanks"] },
    ],
  },
  {
    title: "Statistics",
    topics: [
      { title: "Introduction to Statistics", subTopics: ["Meaning and scope of Statistics", "Primary and secondary data"] },
      { title: "Data Collection", subTopics: ["Methods of collecting Primary Data", "Methods of collecting Secondary Data", "Designing questionnaires"] },
      { title: "Data Organization", subTopics: ["Tabulation and compilation of Data", "Frequency Distribution"] },
      { title: "Measures of Central Tendency", subTopics: ["Mean", "Median", "Mode for grouped/ungrouped data"] },
      { title: "Probability and Attributes", subTopics: ["Theory of Probability", "Theory of Attributes"] },
      { title: "Correlation and Regression", subTopics: ["Correlation - Meaning and types", "Karl Pearson's coefficient", "Regression lines and equations"] },
      { title: "Demographics & Vital Statistics", subTopics: ["Demography - Meaning and scope", "Vital Statistics - Measures of Fertility", "Vital Statistics - Measures of Mortality"] },
    ],
  },
  {
    title: "Mathematics",
    topics: [
      { title: "Arithmetic", subTopics: ["Simple Interest", "Compound Interest"] },
      { title: "Algebra", subTopics: ["Linear equations with one variable", "Linear equations with two variables", "Permutations and Combinations", "Binomial Theorem"] },
      { title: "Calculus", subTopics: ["Introduction to Limits", "Introduction to Derivatives"] },
      { title: "Modern Mathematics", subTopics: ["Set Theory", "Relations and Functions"] },
      { title: "Probability", subTopics: ["Axiomatic approach to Probability", "Sample space and events"] },
      { title: "Matrices & Determinants", subTopics: ["Types and algebra of matrices", "Properties of determinants"] },
      { title: "Co-ordinate Geometry", subTopics: ["Cartesian system", "Distance formula", "Section formula", "Area of a triangle"] },
    ],
  },
  {
    title: "General Economics",
    topics: [
      { title: "Introduction to Economics", subTopics: ["Meaning and scope of Economics", "Basic economic concepts"] },
      { title: "Government Policy", subTopics: ["Fiscal Policy - Meaning, objectives, tools", "Monetary Policy - Meaning, objectives, tools"] },
      { title: "Demand and Production", subTopics: ["Theory of Consumer's Demand", "Concept of Production and Cost", "Laws of Production"] },
      { title: "Market Structures", subTopics: ["Pricing under Perfect Competition", "Pricing under Monopoly", "Pricing under Monopolistic Competition"] },
      { title: "Factors of Production", subTopics: ["Theories of rent", "Theories of wages", "Theories of interest and profit"] },
      { title: "Banking", subTopics: ["Role and functions of the Reserve Bank of India (RBI)"] },
    ],
  },
  {
    title: "General Science",
    topics: [
      { title: "Physics", subTopics: ["Sources of energy - Conventional & Non-conventional", "Newton’s Laws of Motion", "Concepts of Mass, Weight, Acceleration, Velocity, Speed"] },
      { title: "Biology", subTopics: ["Communicable & Non-Communicable Diseases", "Vitamins and deficiency diseases", "Ecosystem - Structure and components"] },
      { title: "Chemistry", subTopics: ["Structure of Atom", "States of Matter", "Writing and balancing Chemical Equations", "Types of Chemical Reactions"] },
    ],
  },
  {
    title: "Computer Applications",
    topics: [
      { title: "Fundamentals", subTopics: ["History and generations of computers", "Hardware & Software concepts", "Input and Output devices"] },
      { title: "System Software", subTopics: ["Operating System - Functions and types"] },
      { title: "MS Office Suite", subTopics: ["M.S Word", "M.S Excel", "M.S Access", "M.S Power-point"] },
      { title: "Internet and Security", subTopics: ["E-mail & Internet concepts", "Computer Viruses and Anti-Virus software"] },
      { title: "Computer Architecture", subTopics: ["Computer Memory - RAM, ROM", "Storage devices - HDD, SSD"] },
    ],
  },
];
