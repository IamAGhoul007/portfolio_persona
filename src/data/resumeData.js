export const RESUME_DATA = {
  name: "Aman Mathur",
  title: "Software Development Engineer & Agentic AI Architect",
  tagline: "S.E.E.S. Operative specializing in autonomous LangGraph multi-agent architectures, real-time PySpark data streams, and enterprise automation.",
  bio: "Software Development Engineer at Prodapt specializing in enterprise automation, LangGraph-orchestrated AI assistants, and real-time telecom analytics. Graduated with a 9.7 / 10.0 CGPA from SRM Institute of Science and Technology.",
  location: "Ajmer, Rajasthan, India",
  phone: "+91 946 043 8773",
  email: "mathur.aman411@gmail.com",
  linkedin: "https://linkedin.com/in/aman-mathur-b62654245",
  linkedinUsername: "aman-mathur-b62654245",
  github: "https://github.com/IamAGhoul007",
  githubUsername: "IamAGhoul007",

  stats: [
    { label: "B.TECH ACADEMIC STANDING", value: "9.7 / 10 CGPA", icon: "GraduationCap", detail: "SRM IST Chennai // CSE" },
    { label: "TACTICAL ROLE", value: "PRODAPT SDE", icon: "Briefcase", detail: "Enterprise Telecom Automation" },
    { label: "VERIFIED ARCANA", value: "8+ CERTS", icon: "Award", detail: "Claude Architect & Oracle AI" },
  ],

  experiences: [
    {
      id: "prodapt-sde",
      role: "Software Development Engineer",
      company: "Prodapt",
      location: "Hyderabad, India",
      period: "July 2026 – Present",
      type: "FULL-TIME S.E.E.S. OPERATIVE",
      highlight: "Enterprise Telecom Automation & Operational Reliability",
      color: "var(--p3-cyan)",
      responsibilities: [
        "Developing and enhancing enterprise automation solutions for telecom operations, automating repetitive user and application support workflows to improve operational efficiency.",
        "Built and improved automation workflows to reduce the inflow of User Education tickets by 15%, minimizing repetitive support requests and improving first-level issue resolution.",
        "Analyzing recurring user issues and support-ticket patterns to identify automation opportunities, streamline resolution workflows, and reduce manual intervention.",
        "Collaborating with cross-functional teams to understand business requirements, troubleshoot production issues, and continuously improve automation reliability and scalability.",
        "Participating in code reviews, technical discussions, and Agile ceremonies while following engineering best practices for maintainable and reliable automation solutions."
      ],
      skills: ["Python", "FastAPI", "Enterprise Automation", "Agile", "Telecom Ops", "System Reliability"]
    },
    {
      id: "prodapt-intern",
      role: "AI Intern",
      company: "Prodapt",
      location: "Chennai, India",
      period: "February 2026 – June 2026",
      type: "AI SPECIALIST INTERN",
      highlight: "Autonomous Agentic AI Assistants & 90%+ Predictive Maintenance",
      color: "var(--p3-crimson)",
      responsibilities: [
        "Developed AI-driven full-stack applications and intelligent automation systems using Python, FastAPI, React, PySpark, LangChain, and Apache Airflow across telecom analytics and customer support domains.",
        "Engineered scalable ETL pipelines, real-time analytical dashboards, and machine learning models for telecom network monitoring and predictive maintenance, achieving 90+ percent prediction accuracy and improving operational reliability.",
        "Built autonomous agentic AI assistants with RAG, LangGraph orchestration, ChromaDB vector search, and Human-in-the-Loop workflows, reducing customer support resolution times by 60 percent."
      ],
      skills: ["LangGraph", "LangChain", "PySpark", "Apache Airflow", "FastAPI", "React", "ChromaDB", "RAG"]
    },
    {
      id: "softech-intern",
      role: "Python Developer Intern",
      company: "Softech Pvt. Ltd.",
      location: "Ajmer, India (On-site)",
      period: "May 2024 – June 2024",
      type: "FOUNDATIONAL INTERNSHIP",
      highlight: "Core Python Optimization & 30% Code Quality Boost",
      color: "var(--p3-gold)",
      responsibilities: [
        "Contributed to core Python development across 3 internal projects, improving code quality by 30 percent through refactoring and optimization.",
        "Collaborated with a team of 5 developers using Scikit-learn and Pandas in an Agile environment, delivering features 20 percent faster."
      ],
      skills: ["Python", "Scikit-learn", "Pandas", "Code Refactoring", "Agile", "Git"]
    }
  ],

  projects: [
    {
      id: "ecommerce-bot",
      title: "OPERATIONAL ARCHIVE // ECOMMERCE BOT",
      subtitle: "Autonomous Customer Support Agent with LangGraph & HITL",
      year: "2024",
      image: "./assets/p3_ecommerce.jpg",
      github: "https://github.com/IamAGhoul007/Ecommerce-Bot",
      tags: ["Python", "LangChain 1.x", "LangGraph", "Streamlit", "ChromaDB", "OpenAI", "SQLite"],
      badge: "60% Ticket Reduction",
      accent: "var(--p3-cyan)",
      summary: "Autonomous customer support chatbot orchestrating complex multi-turn dialogs with SQLite-based graph checkpointing and secure Human-in-the-Loop middleware.",
      points: [
        "Engineered autonomous customer support chatbot using LangChain 1.x and LangGraph, orchestrating complex multi-turn dialogs with SQLite-based graph checkpointing mechanism.",
        "Implemented secure Human-in-the-Loop workflow with custom middleware for critical transactions, reducing support ticket resolution times by 60%.",
        "Integrated hybrid RAG and SQL retrieval system powered by ChromaDB for semantic vector search, maintaining zero user data leaks.",
        "Developed automated Gmail API notification services reducing customer query response delays by 80%."
      ],
      demoType: "ecommerce"
    },
    {
      id: "telecom-intelligence",
      title: "TACTICAL RADAR // TELECOM NETWORK INTELLIGENCE",
      subtitle: "PySpark ETL, Airflow DAGs & 90%+ Equipment Risk Predictor",
      year: "2024",
      image: "./assets/p3_telecom.jpg",
      github: "https://github.com/IamAGhoul007/Prodapt-Capstone-Assignment",
      tags: ["Python", "PySpark", "Apache Airflow", "FastAPI", "React", "ML", "Random Forest"],
      badge: "99.9% Pipeline Reliability",
      accent: "var(--p3-cyan)",
      summary: "End-to-end full-stack data pipeline processing real-time network logs and cell tower performance KPIs with automated Airflow workflows.",
      points: [
        "Engineered end-to-end full-stack data pipeline using React and FastAPI to process and visualize real-time network logs and cell tower performance KPIs.",
        "Built scalable PySpark ETL pipeline with custom feature engineering on massive datasets, loading into SQLite Star Schema warehouse.",
        "Orchestrated automated workflows using Apache Airflow DAGs with schema validation, achieving 99.9 percent pipeline reliability.",
        "Integrated Random Forest model achieving 90+ percent accuracy in classifying equipment failure risks, reducing network downtime by 20%."
      ],
      demoType: "telecom"
    },
    {
      id: "sentiment-analysis",
      title: "COGNITIVE PSYCHE // SENTIMENT NLP ENGINE",
      subtitle: "Voice & Text AI Analytics for 5,000+ Customer Reviews",
      year: "2024",
      image: "./assets/p3_sentiment.jpg",
      github: "https://github.com/IamAGhoul007/Sentiment-Analysis-ML-PROJECT",
      tags: ["Python", "TensorFlow", "NLTK", "SpaCy", "NLP", "Speech Recognition"],
      badge: "89% Accuracy & +15% CSAT",
      accent: "var(--p3-gold)",
      summary: "End-to-end AI system processing voice calls and text reviews to extract granular sentiment trends and elevate customer satisfaction.",
      points: [
        "Developed end-to-end AI system processing voice calls and text reviews with 89 percent accuracy in sentiment classification.",
        "Created interactive dashboard analyzing 5,000+ customer reviews, generating insights that improved customer satisfaction by 15%."
      ],
      demoType: "sentiment"
    }
  ],

  skillsData: [
    {
      category: "PROGRAMMING LANGUAGES",
      icon: "Code",
      skills: [
        { name: "Python", level: 98, highlight: "Primary Language / Multi-Threading", stars: 5 },
        { name: "SQL", level: 92, highlight: "Complex Analytical Star Schemas", stars: 5 },
        { name: "JavaScript", level: 85, highlight: "ES6+, React, Async Architecture", stars: 4 },
        { name: "C / C++", level: 82, highlight: "Core Memory & Algorithmic Foundations", stars: 4 },
        { name: "R", level: 75, highlight: "Statistical Modeling & Regressions", stars: 4 },
        { name: "Java", level: 78, highlight: "Object-Oriented Enterprise Design", stars: 4 },
        { name: "HTML5 / CSS3", level: 90, highlight: "High-Tech Sci-Fi JRPG Interfaces", stars: 5 }
      ]
    },
    {
      category: "AGENTIC AI & MACHINE LEARNING",
      icon: "Bot",
      skills: [
        { name: "LangGraph", level: 95, highlight: "Stateful Agent Graphs & Checkpoints", stars: 5 },
        { name: "LangChain", level: 95, highlight: "Tool-Use, Chains & RAG Orchestration", stars: 5 },
        { name: "RAG Systems", level: 94, highlight: "Hybrid Vector + SQL Retrieval", stars: 5 },
        { name: "ChromaDB", level: 90, highlight: "Semantic Embeddings & Search", stars: 5 },
        { name: "TensorFlow", level: 85, highlight: "Deep Neural Networks & Audio NLP", stars: 4 },
        { name: "Scikit-learn", level: 92, highlight: "Random Forest & Risk Classifiers", stars: 5 },
        { name: "SpaCy & NLTK", level: 88, highlight: "Entity Extraction & Tokenizers", stars: 4 },
        { name: "Human-in-the-Loop", level: 92, highlight: "Supervised Critical Middleware", stars: 5 }
      ]
    },
    {
      category: "DISTRIBUTED DATA & CLOUD",
      icon: "Cloud",
      skills: [
        { name: "PySpark", level: 90, highlight: "Distributed Big Data Processing", stars: 5 },
        { name: "Apache Airflow", level: 88, highlight: "DAG Pipelines & Schema Validation", stars: 4 },
        { name: "ETL Pipelines", level: 92, highlight: "Star Schema & Lakehouse Modeling", stars: 5 },
        { name: "Oracle Cloud Infrastructure", level: 88, highlight: "Certified OCI GenAI & Data Science", stars: 4 },
        { name: "PostgreSQL", level: 86, highlight: "Relational Queries & Indexing", stars: 4 },
        { name: "MongoDB", level: 84, highlight: "NoSQL JSON Document Stores", stars: 4 },
        { name: "Docker", level: 82, highlight: "Containerization & Deployment", stars: 4 }
      ]
    },
    {
      category: "FRAMEWORKS & TACTICAL TOOLS",
      icon: "Layers",
      skills: [
        { name: "FastAPI", level: 92, highlight: "Asynchronous High-Throughput REST APIs", stars: 5 },
        { name: "React", level: 88, highlight: "Persona 3 / Sci-Fi Interactive SPAs", stars: 4 },
        { name: "Flask", level: 85, highlight: "Lightweight Microservices", stars: 4 },
        { name: "Streamlit", level: 90, highlight: "Rapid AI Prototyping Dashboards", stars: 5 },
        { name: "Playwright", level: 84, highlight: "Headless Browser Automation", stars: 4 },
        { name: "Git & GitHub", level: 94, highlight: "Version Control & CI/CD", stars: 5 },
        { name: "Agile Ceremonies", level: 90, highlight: "Sprint Architecture & Code Reviews", stars: 5 }
      ]
    }
  ],

  certifications: [
    {
      title: "Claude Certified Architect",
      issuer: "Anthropic",
      validity: "Professional · Valid through October 2027",
      tier: "ARCHITECT ARCANA",
      badgeColor: "linear-gradient(135deg, #FF1E44, #FF5500)",
      tag: "TOP ANTHROPIC CREDENTIAL",
      featured: true,
      icon: "Sparkles",
      description: "Validated mastery of advanced LLM system architectures, Claude prompt engineering, safety guardrails, tool use, and multi-agent systems."
    },
    {
      title: "Claude Certified Developer",
      issuer: "Anthropic",
      validity: "Foundations · Valid through October 2027",
      tier: "DEVELOPER ARCANA",
      badgeColor: "linear-gradient(135deg, #00D2FF, #0055FF)",
      tag: "ANTHROPIC OFFICIAL",
      featured: true,
      icon: "Code",
      description: "Demonstrated proficiency in developing, testing, and shipping robust applications powered by Anthropic's Claude models."
    },
    {
      title: "OCI Certified Data Science Professional",
      issuer: "Oracle",
      validity: "Issued August 2024",
      tier: "CLOUD ML",
      badgeColor: "linear-gradient(135deg, #0077B6, #00B4D8)",
      tag: "ORACLE CLOUD",
      featured: true,
      icon: "Cloud",
      description: "Oracle Cloud Infrastructure certification for end-to-end data science pipelines, model training, deployment, and MLOps."
    },
    {
      title: "OCI Certified Generative AI Professional",
      issuer: "Oracle",
      validity: "Issued August 2024",
      tier: "GEN-AI SPECIALIST",
      badgeColor: "linear-gradient(135deg, #E65100, #FF9800)",
      tag: "ORACLE CLOUD",
      featured: true,
      icon: "Zap",
      description: "Specialized certification in generative AI models, vector stores, RAG architectures, and enterprise enterprise LLM tuning on Oracle Cloud."
    },
    {
      title: "Machine Learning Certificate",
      issuer: "Columbia+",
      validity: "Issued July 2024",
      tier: "ACADEMIC ARCANA",
      badgeColor: "linear-gradient(135deg, #1A237E, #3949AB)",
      tag: "COLUMBIA UNIVERSITY+",
      featured: false,
      icon: "BookOpen",
      description: "Rigorous ML curriculum covering supervised/unsupervised algorithms, deep neural nets, loss optimization, and evaluation metrics."
    },
    {
      title: "Data Analyst Certificate",
      issuer: "OneRoadMap",
      validity: "Issued June 2024",
      tier: "ANALYTICS",
      badgeColor: "linear-gradient(135deg, #2E7D32, #66BB6A)",
      tag: "DATA ANALYSIS",
      featured: false,
      icon: "PieChart",
      description: "Comprehensive data wrangling, SQL analytics, visualization dashboards, and statistical interpretation."
    },
    {
      title: "Data Analytics Job Simulation",
      issuer: "Deloitte Australia (Forage)",
      validity: "Issued May 2024",
      tier: "SIMULATION",
      badgeColor: "linear-gradient(135deg, #004D40, #00897B)",
      tag: "INDUSTRY CLIENT SIM",
      featured: false,
      icon: "Briefcase",
      description: "Completed practical client simulations in forensic data analysis, business telemetry, and executive reporting."
    },
    {
      title: "Data Analysis Bootcamp",
      issuer: "Udemy",
      validity: "Issued December 2023",
      tier: "FOUNDATIONAL",
      badgeColor: "linear-gradient(135deg, #6A1B9A, #AB47BC)",
      tag: "BOOTCAMP",
      featured: false,
      icon: "CheckCircle",
      description: "Intensive training in Python, Pandas, NumPy, statistical hypothesis testing, and interactive reporting."
    }
  ],

  education: [
    {
      institution: "S.R.M. Institute of Science and Technology",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      score: "CGPA: 9.7 / 10.0",
      location: "Chennai, India",
      period: "September 2022 – May 2026",
      highlight: "Top Academic Standing · Core CS, AI & Distributed Systems",
      icon: "GraduationCap"
    },
    {
      institution: "Turning Point School",
      degree: "CBSE Class 12th — Science and Mathematics",
      score: "Percentage: 87.8%",
      location: "Ajmer, India",
      period: "Completed March 2022",
      highlight: "Excellence in Mathematics & Physics",
      icon: "School"
    }
  ],

  // S.E.E.S. Aegis Terminal Q&A
  botQnA: [
    {
      keywords: ["hi", "hello", "hey", "who are you", "intro", "mission"],
      response: "TACTICAL TERMINAL READY. I am Aegis Tactical Intel, assisting S.E.E.S. Operative Aman Mathur. Aman is a Software Development Engineer at Prodapt and a Claude Certified AI Architect (SRM CSE 9.7 CGPA). State your query, Commander!",
      emotion: "ready"
    },
    {
      keywords: ["prodapt", "work", "job", "experience", "current", "company"],
      response: "DEPLOYMENT DATA: Aman is deployed as SDE at Prodapt Hyderabad (July 2026 – Present). He engineers enterprise automation for telecom operations, reducing User Education ticket inflow by 15% and increasing operational scalability.",
      emotion: "intel"
    },
    {
      keywords: ["langgraph", "langchain", "ecommerce", "bot", "support", "agent"],
      response: "SPECIAL ARSENAL: Aman engineered the Ecommerce Bot using LangChain 1.x and LangGraph with SQLite graph state checkpointing, custom Human-in-the-Loop middleware, and ChromaDB hybrid vector RAG. Support ticket resolution time slashed by 60%!",
      emotion: "weapon"
    },
    {
      keywords: ["telecom", "pyspark", "airflow", "network", "capstone"],
      response: "TELEMETRY RADAR: Aman engineered the Telecom Network Intelligence Platform using PySpark distributed ETL, Airflow DAG orchestration (99.9% reliability), and a Random Forest risk model classifying equipment failure risks at 90.4% accuracy!",
      emotion: "radar"
    },
    {
      keywords: ["sentiment", "nlp", "reviews", "tensorflow"],
      response: "COGNITIVE PSYCHE: The Sentiment Analysis System leverages TensorFlow, SpaCy, and NLTK across 5,000+ voice calls and text reviews with 89% classification accuracy, improving customer satisfaction metrics by 15%!",
      emotion: "psyche"
    },
    {
      keywords: ["certifications", "claude", "anthropic", "oracle", "certificate", "arcana"],
      response: "VERIFIED ARCANA: Aman holds the elite Claude Certified Architect and Claude Certified Developer credentials from Anthropic (valid through October 2027), along with Oracle Cloud Generative AI & Data Science Professional certifications!",
      emotion: "arcana"
    },
    {
      keywords: ["education", "cgpa", "college", "degree", "srm"],
      response: "ACADEMIC INTEL: Graduating B.Tech Computer Science and Engineering from SRM IST Chennai with a 9.7 / 10.0 CGPA. Prior CBSE 12th Science & Mathematics score: 87.8%.",
      emotion: "record"
    },
    {
      keywords: ["hire", "contact", "email", "phone", "reach", "interview"],
      response: "S.E.E.S. RECRUITMENT LINK: Aman is open to high-impact AI Engineering and Full-Stack Automation missions! Direct transmission: mathur.aman411@gmail.com or voice link +91 946 043 8773. LinkedIn: /in/aman-mathur-b62654245!",
      emotion: "recruit"
    },
    {
      keywords: ["game", "secret", "dark hour", "battle", "combat"],
      response: "TACTICAL OVERRIDE CONFIRMED: You can initiate the Tartarus Battle Simulator anytime from the top bar 'COMBAT [SIM]' button or by tapping the S.E.E.S. Moon badge 5 times!",
      emotion: "secret"
    }
  ]
};
