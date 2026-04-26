// src/data/studyData.js

export const branches = [
    { id: 'cse', name: 'Computer Science & Engineering', icon: '💻', color: '#6366f1' },
    { id: 'ece', name: 'Electronics & Communication', icon: '📡', color: '#0ea5e9' },
    { id: 'me',  name: 'Mechanical Engineering', icon: '⚙️', color: '#f59e0b' },
    { id: 'ce',  name: 'Civil Engineering', icon: '🏗️', color: '#10b981' },
    { id: 'ee',  name: 'Electrical Engineering', icon: '⚡', color: '#ef4444' }
];

export const subjectColors = {
    'dsa':       { bg: 'rgba(99,102,241,0.12)',  border: '#818cf8', text: '#a5b4fc', icon: '🧮' },
    'coa':       { bg: 'rgba(14,165,233,0.12)',   border: '#38bdf8', text: '#7dd3fc', icon: '🖥️' },
    'dbms':      { bg: 'rgba(168,85,247,0.12)',   border: '#a78bfa', text: '#c4b5fd', icon: '🗄️' },
    'os':        { bg: 'rgba(236,72,153,0.12)',    border: '#f472b6', text: '#f9a8d4', icon: '🐧' },
    'cn':        { bg: 'rgba(20,184,166,0.12)',    border: '#2dd4bf', text: '#5eead4', icon: '🌐' },
    'math':      { bg: 'rgba(245,158,11,0.12)',    border: '#fbbf24', text: '#fcd34d', icon: '📐' },
    'physics':   { bg: 'rgba(99,102,241,0.12)',    border: '#818cf8', text: '#a5b4fc', icon: '⚛️' },
    'chemistry': { bg: 'rgba(16,185,129,0.12)',    border: '#34d399', text: '#6ee7b7', icon: '🧪' },
    'english':   { bg: 'rgba(251,146,60,0.12)',    border: '#fb923c', text: '#fdba74', icon: '📖' },
    'bee':       { bg: 'rgba(239,68,68,0.12)',     border: '#f87171', text: '#fca5a5', icon: '⚡' },
    'emft':      { bg: 'rgba(14,165,233,0.12)',    border: '#38bdf8', text: '#7dd3fc', icon: '🧲' },
    'signals':   { bg: 'rgba(168,85,247,0.12)',    border: '#a78bfa', text: '#c4b5fd', icon: '📊' },
    'micro':     { bg: 'rgba(20,184,166,0.12)',    border: '#2dd4bf', text: '#5eead4', icon: '🔬' },
    'thermo':    { bg: 'rgba(245,158,11,0.12)',    border: '#fbbf24', text: '#fcd34d', icon: '🌡️' },
    'fluid':     { bg: 'rgba(56,189,248,0.12)',    border: '#38bdf8', text: '#7dd3fc', icon: '💧' },
    'som':       { bg: 'rgba(239,68,68,0.12)',     border: '#f87171', text: '#fca5a5', icon: '🏋️' },
    'survey':    { bg: 'rgba(16,185,129,0.12)',    border: '#34d399', text: '#6ee7b7', icon: '📏' },
    'concrete':  { bg: 'rgba(251,146,60,0.12)',    border: '#fb923c', text: '#fdba74', icon: '🧱' },
    'machines':  { bg: 'rgba(236,72,153,0.12)',    border: '#f472b6', text: '#f9a8d4', icon: '🔌' },
    'pse':       { bg: 'rgba(99,102,241,0.12)',    border: '#818cf8', text: '#a5b4fc', icon: '🔋' },
    'webtech':   { bg: 'rgba(251,146,60,0.12)',    border: '#fb923c', text: '#fdba74', icon: '🌐' },
    'toc':       { bg: 'rgba(139,92,246,0.12)',    border: '#a78bfa', text: '#c4b5fd', icon: '🧠' },
    'cloud':     { bg: 'rgba(56,189,248,0.12)',    border: '#38bdf8', text: '#7dd3fc', icon: '☁️' },
    'or':        { bg: 'rgba(245,158,11,0.12)',    border: '#fbbf24', text: '#fcd34d', icon: '📊' },
    'statsml':   { bg: 'rgba(16,185,129,0.12)',    border: '#34d399', text: '#6ee7b7', icon: '📈' },
    'psa':       { bg: 'rgba(236,72,153,0.12)',    border: '#f472b6', text: '#f9a8d4', icon: '🧩' },
    'ai':        { bg: 'rgba(168,85,247,0.12)',    border: '#a78bfa', text: '#c4b5fd', icon: '🤖' },
    'java':      { bg: 'rgba(239,68,68,0.12)',     border: '#f87171', text: '#fca5a5', icon: '☕' },
    'stats':     { bg: 'rgba(16,185,129,0.12)',    border: '#34d399', text: '#6ee7b7', icon: '📈' },
    'default':   { bg: 'rgba(148,163,184,0.12)',   border: '#94a3b8', text: '#cbd5e1', icon: '📘' },
};

export const semesters = {
    'cse': {
        1: [
            {
                id: 'math-1', key: 'math', title: 'Engineering Mathematics I', code: 'KAS101',
                units: [
                    {
                        title: 'Unit 1: Matrices',
                        aiSummary: 'Matrices are rectangular arrays of numbers. Key Topics: Types of matrices (symmetric, skew-symmetric, orthogonal), Rank of a matrix using echelon form, Cayley-Hamilton theorem for finding inverse, Eigenvalues and Eigenvectors — essential for stability analysis. Important: Practice characteristic equations and diagonalization.',
                        ppts: [{ title: 'Matrices Complete Lecture', size: '3.2 MB' }],
                        notes: [{ title: 'Quick Revision - Matrices', desc: 'All formulas & solved examples' }],
                        youtube: [
                            { title: 'Matrices Full Course', channel: 'Dr. Gajendra Purohit', url: 'https://www.youtube.com/watch?v=bwRjC_SRQAI' },
                            { title: 'Eigenvalues & Eigenvectors', channel: 'Neso Academy', url: 'https://www.youtube.com/watch?v=PFDu9oVAE-g' }
                        ]
                    },
                    {
                        title: 'Unit 2: Differential Calculus',
                        aiSummary: 'Covers successive differentiation, Leibniz theorem, Rolle\'s theorem, Mean Value theorems (Lagrange & Cauchy), Taylor and Maclaurin series expansions. Tip: Master the expansion formulas — they appear every exam.',
                        ppts: [{ title: 'Differential Calculus Slides', size: '2.8 MB' }],
                        notes: [{ title: 'Formulas Sheet - Calculus', desc: 'All differentiation rules + solved PYQs' }],
                        youtube: [
                            { title: 'Calculus in One Shot', channel: 'Anurag Chauhan', url: 'https://www.youtube.com/watch?v=HfACrKJ_Y2w' }
                        ]
                    }
                ]
            },
            {
                id: 'physics-1', key: 'physics', title: 'Engineering Physics', code: 'KAS102',
                units: [
                    {
                        title: 'Unit 1: Wave Optics',
                        aiSummary: 'Interference: Young\'s double-slit experiment, Newton\'s rings, thin film interference. Diffraction: Fresnel vs Fraunhofer, single slit diffraction pattern. Polarization: Brewster\'s law, Malus law, double refraction. Key formulas: fringe width = λD/d, resolving power of grating = nN.',
                        ppts: [{ title: 'Wave Optics Lecture', size: '2.1 MB' }],
                        notes: [{ title: 'Optics Quick Notes', desc: 'Derivations and numericals' }],
                        youtube: [
                            { title: 'Wave Optics Complete', channel: 'Physics Wallah', url: 'https://www.youtube.com/watch?v=6OUEfkGCJpY' }
                        ]
                    }
                ]
            },
            {
                id: 'english-1', key: 'english', title: 'Technical Communication', code: 'KAS103',
                units: [
                    {
                        title: 'Unit 1: Communication Skills',
                        aiSummary: 'Technical communication involves precise, clear, and structured writing. Key areas: report writing, presentation skills, business correspondence, grammar essentials. Focus on active voice, conciseness, and audience analysis.',
                        ppts: [{ title: 'Communication Skills PPT', size: '1.5 MB' }],
                        notes: [{ title: 'Grammar Quick Reference', desc: 'Common errors & business letter formats' }],
                        youtube: [
                            { title: 'Technical Communication', channel: 'Ekeeda', url: 'https://www.youtube.com/watch?v=oBq7YqkG-4Y' }
                        ]
                    }
                ]
            }
        ],
        2: [
          {
            id: 'math-2', key: 'math', title: 'Engineering Mathematics II', code: 'KAS201',
            units: [
                {
                    title: 'Unit 1: Fourier Series',
                    aiSummary: 'Fourier series for periodic functions, Dirichlet conditions, Half-range expansions, Parseval\'s identity. Essential for signal analysis and wave equations.',
                    ppts: [{ title: 'Fourier Series', size: '2.5 MB' }],
                    notes: [{ title: 'Fourier Notes', desc: 'Key theorems and solved problems' }],
                    youtube: [{ title: 'Fourier Series', channel: 'Dr. Gajendra Purohit', url: 'https://youtube.com' }]
                }
            ]
          }
        ],
        3: [
          {
            id: 'dsa-1', key: 'dsa', title: 'Data Structures & Algorithms I', code: 'BMICSE0301',
            units: [
                {
                    title: 'Unit 1: Arrays & Linked Lists',
                    aiSummary: 'Fundamental data structures. Array operations, time complexity. Linked list types: singly, doubly, circular. Implementation and applications.',
                    ppts: [{ title: 'DSA Basics', size: '4.1 MB' }],
                    notes: [{ title: 'DSA Cheat Sheet', desc: 'Operations and complexities' }],
                    youtube: [{ title: 'DSA Complete Course', channel: 'Abdul Bari', url: 'https://youtube.com' }]
                }
            ]
          }
        ],
        4: [
            {
                id: 'dsa2-1', key: 'dsa', title: 'Data Structures & Algorithms II', code: 'BMICSE0401',
                units: [
                    {
                        title: 'Unit 1: Graph Algorithms',
                        aiSummary: 'Graph G = (V, E). Representations: Adjacency Matrix, Adjacency List. BFS, DFS. Shortest Path: Dijkstra, Bellman-Ford. MST: Prim\'s, Kruskal\'s.',
                        ppts: [{ title: 'Graph Algorithms PPT', size: '3.5 MB', url: '/pdfs/dsa2/DSA-II Unit-V.pptx' }],
                        notes: [{ title: 'Graph Cheat Sheet', desc: 'BFS, DFS, Dijkstra, Kruskal, Prim' }],
                        youtube: [{ title: 'Graph Traversals', channel: 'Abdul Bari', url: 'https://youtube.com' }]
                    }
                ]
            },
            {
                id: 'dbms-1', key: 'dbms', title: 'Database Management Systems', code: 'BMICSE0402',
                units: [
                    {
                        title: 'Unit 1: ER Modeling',
                        aiSummary: 'Database design using ER Model: Entities, Attributes, Relationships. Cardinality. Normalization: 1NF, 2NF, 3NF, BCNF.',
                        ppts: [
                            { title: 'ER Model & Design PPT', size: '2.5 MB', url: '/pdfs/dbms/dbms4.pdf' },
                            { title: 'Database Design Advanced', size: '1.8 MB', url: '/pdfs/dbms/dbms5.pdf' }
                        ],
                        notes: [{ title: 'ER Diagram Cheat Sheet', desc: 'Symbols and mapping rules' }],
                        youtube: [{ title: 'DBMS Full Course', channel: 'Gate Smashers', url: 'https://youtube.com' }]
                    }
                ]
            },
            {
                id: 'os-1', key: 'os', title: 'Operating Systems', code: 'BMICSE0403',
                units: [
                    {
                        title: 'Unit 1: Introduction to OS',
                        aiSummary: 'Functions of OS, types of OS. Process management, CPU scheduling, memory management, file systems.',
                        ppts: [{ title: 'OS Introduction PPT', size: '2.8 MB' }],
                        notes: [{ title: 'OS Quick Notes', desc: 'Summary of all OS concepts' }],
                        youtube: [{ title: 'OS Full Course', channel: 'Gate Smashers', url: 'https://youtube.com' }]
                    }
                ]
            }
        ],
        5: [
            {
                id: 'webtech-1', key: 'webtech', title: 'Web Technologies', code: 'KCS501',
                units: [
                    { title: 'Unit 1: HTML5 & CSS3', aiSummary: 'HTML5 semantic elements, forms, media. CSS3 selectors, box model, flexbox, grid layout, animations and transitions.', ppts: [{ title: 'HTML & CSS PPT', size: '3.0 MB' }], notes: [{ title: 'CSS Quick Reference', desc: 'Flexbox and grid cheat sheet' }], youtube: [{ title: 'HTML & CSS Full Course', channel: 'Traversy Media', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: JavaScript & DOM', aiSummary: 'JavaScript ES6+ features: arrow functions, promises, async/await, destructuring. DOM manipulation, event handling, AJAX and Fetch API.', ppts: [{ title: 'JavaScript Essentials', size: '3.5 MB' }], notes: [{ title: 'JS Cheat Sheet', desc: 'ES6 features and DOM methods' }], youtube: [{ title: 'JavaScript Crash Course', channel: 'Traversy Media', url: 'https://youtube.com' }] },
                    { title: 'Unit 3: PHP & MySQL', aiSummary: 'PHP syntax, arrays, functions, OOP. MySQL queries, joins, stored procedures. CRUD operations and form handling.', ppts: [{ title: 'PHP & MySQL', size: '2.8 MB' }], notes: [{ title: 'PHP Quick Reference', desc: 'Common PHP functions' }], youtube: [{ title: 'PHP Full Course', channel: 'Traversy Media', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'toc-1', key: 'toc', title: 'Theory of Computation', code: 'KCS502',
                units: [
                    { title: 'Unit 1: Finite Automata', aiSummary: 'DFA, NFA, epsilon-NFA. Equivalence of DFA and NFA, minimization of DFA. Regular languages, regular expressions, Pumping Lemma.', ppts: [{ title: 'Finite Automata PPT', size: '3.2 MB', url: '/pdfs/toc/toc_unit1.pdf' }], notes: [{ title: 'Automata Notes', desc: 'DFA/NFA constructions' }], youtube: [{ title: 'Theory of Computation', channel: 'Neso Academy', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Context-Free Languages', aiSummary: 'Context-free grammars, parse trees, ambiguity. Pushdown automata (PDA). Pumping Lemma for CFLs. Chomsky Normal Form.', ppts: [{ title: 'CFG & PDA PPT', size: '2.9 MB' }], notes: [{ title: 'CFL Notes', desc: 'Grammar simplifications' }], youtube: [{ title: 'CFG and PDA', channel: 'Neso Academy', url: 'https://youtube.com' }] },
                    { title: 'Unit 3: Turing Machines', aiSummary: 'Turing machine model, variants. Decidable and undecidable problems, Halting Problem. Complexity classes P, NP, NP-Complete.', ppts: [{ title: 'Turing Machines', size: '3.0 MB' }], notes: [{ title: 'TM Notes', desc: 'Decidability and complexity' }], youtube: [{ title: 'Turing Machines', channel: 'Neso Academy', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ai-1', key: 'ai', title: 'Artificial Intelligence', code: 'KCS503',
                units: [
                    { title: 'Unit 1: Problem Solving & Search', aiSummary: 'State space search, uninformed search (BFS, DFS, IDS), informed search (A*, heuristics). Admissibility and consistency of heuristics.', ppts: [{ title: 'AI Search Algorithms', size: '3.4 MB' }], notes: [{ title: 'Search Algorithms', desc: 'Comparison and complexity' }], youtube: [{ title: 'AI Fundamentals', channel: 'NPTEL', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Knowledge Representation', aiSummary: 'Propositional and predicate logic, resolution, unification. Semantic networks, frames, production rules, forward and backward chaining.', ppts: [{ title: 'Knowledge Representation', size: '2.7 MB' }], notes: [{ title: 'Logic & Inference', desc: 'Resolution and unification' }], youtube: [{ title: 'Knowledge Representation', channel: 'NPTEL', url: 'https://youtube.com' }] },
                    { title: 'Unit 3: Machine Learning Basics', aiSummary: 'Supervised, unsupervised, reinforcement learning. Linear regression, classification, decision trees, neural network fundamentals.', ppts: [{ title: 'ML Basics', size: '3.8 MB' }], notes: [{ title: 'ML Algorithms', desc: 'Overview with use cases' }], youtube: [{ title: 'Machine Learning', channel: 'Sentdex', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'cn-1', key: 'cn', title: 'Computer Networks', code: 'KCS504',
                units: [
                    { title: 'Unit 1: Network Models & Physical Layer', aiSummary: 'OSI and TCP/IP models, layer functions. Transmission media, multiplexing, switching (circuit, packet, message). Shannon\'s capacity theorem.', ppts: [{ title: 'Computer Networks I', size: '3.3 MB' }], notes: [{ title: 'OSI vs TCP/IP', desc: 'Layer-by-layer comparison' }], youtube: [{ title: 'Computer Networks', channel: 'Gate Smashers', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Data Link & Network Layer', aiSummary: 'Error detection (CRC, checksum), flow control (sliding window). IP addressing, subnetting, routing algorithms (Dijkstra, Bellman-Ford in networking context).', ppts: [{ title: 'Data Link & Network', size: '3.1 MB' }], notes: [{ title: 'Subnetting Guide', desc: 'CIDR and subnet masks' }], youtube: [{ title: 'Network Layer', channel: 'Gate Smashers', url: 'https://youtube.com' }] },
                    { title: 'Unit 3: Transport & Application Layer', aiSummary: 'TCP vs UDP, connection establishment (3-way handshake), congestion control. HTTP, HTTPS, DNS, SMTP, FTP protocols. Socket programming basics.', ppts: [{ title: 'Transport & Application', size: '2.9 MB' }], notes: [{ title: 'Protocol Notes', desc: 'TCP/UDP and application protocols' }], youtube: [{ title: 'Transport Layer', channel: 'Gate Smashers', url: 'https://youtube.com' }] }
                ]
            }
        ],
        6: [
            {
                id: 'cloud-1', key: 'cloud', title: 'Cloud Computing', code: 'KCS601',
                units: [
                    { title: 'Unit 1: Cloud Fundamentals', aiSummary: 'Cloud computing definition, characteristics, service models (IaaS, PaaS, SaaS), deployment models (public, private, hybrid). Virtualization technologies.', ppts: [{ title: 'Cloud Computing Basics', size: '3.1 MB' }], notes: [{ title: 'Cloud Models', desc: 'Service and deployment models' }], youtube: [{ title: 'Cloud Computing', channel: 'Simplilearn', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: AWS & Azure Fundamentals', aiSummary: 'AWS core services: EC2, S3, RDS, Lambda. Azure: VMs, Blob Storage, Azure Functions. Cloud pricing models and cost optimization.', ppts: [{ title: 'AWS & Azure', size: '3.6 MB' }], notes: [{ title: 'Cloud Services Cheat Sheet', desc: 'AWS vs Azure comparison' }], youtube: [{ title: 'AWS for Beginners', channel: 'TechWorld with Nana', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'infosec-1', key: 'cn', title: 'Information Security', code: 'KCS602',
                units: [
                    { title: 'Unit 1: Cryptography', aiSummary: 'Symmetric encryption (AES, DES), asymmetric encryption (RSA), hashing (SHA). Digital signatures, PKI, SSL/TLS protocol.', ppts: [{ title: 'Cryptography PPT', size: '3.4 MB' }], notes: [{ title: 'Crypto Notes', desc: 'Algorithms and applications' }], youtube: [{ title: 'Cryptography Course', channel: 'Computerphile', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Network Security', aiSummary: 'Firewalls, IDS/IPS, VPNs. Common attacks: MITM, DDoS, SQL injection, XSS. OWASP Top 10 vulnerabilities and mitigations.', ppts: [{ title: 'Network Security', size: '2.9 MB' }], notes: [{ title: 'Security Attacks', desc: 'Attack types and countermeasures' }], youtube: [{ title: 'Network Security', channel: 'Cybrary', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'statsml-1', key: 'statsml', title: 'Statistics & Machine Learning', code: 'KCS603',
                units: [
                    { title: 'Unit 1: Probability & Statistics', aiSummary: 'Probability distributions (Normal, Binomial, Poisson), statistical inference, hypothesis testing, confidence intervals.', ppts: [{ title: 'Statistics PPT', size: '2.8 MB' }], notes: [{ title: 'Stats Formulas', desc: 'Distributions and tests' }], youtube: [{ title: 'Statistics for Data Science', channel: 'StatQuest', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Supervised Learning', aiSummary: 'Linear and logistic regression, SVMs, decision trees, random forests, ensemble methods. Model evaluation: precision, recall, F1, ROC curve.', ppts: [{ title: 'Supervised Learning', size: '3.5 MB' }], notes: [{ title: 'ML Algorithms', desc: 'Pros/cons comparison table' }], youtube: [{ title: 'Machine Learning A-Z', channel: 'StatQuest', url: 'https://youtube.com' }] },
                    { title: 'Unit 3: Unsupervised & Deep Learning', aiSummary: 'K-means, hierarchical clustering, PCA. Neural networks, backpropagation, CNNs for image recognition, RNNs for sequences.', ppts: [{ title: 'Deep Learning Intro', size: '4.0 MB' }], notes: [{ title: 'Neural Networks', desc: 'Architecture and training' }], youtube: [{ title: 'Deep Learning', channel: '3Blue1Brown', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'compiler-1', key: 'toc', title: 'Compiler Design', code: 'KCS604',
                units: [
                    { title: 'Unit 1: Lexical & Syntax Analysis', aiSummary: 'Phases of compilation. Lexical analysis: tokens, patterns, lexemes. Syntax analysis: top-down (LL) and bottom-up (LR) parsing, parse trees.', ppts: [{ title: 'Compiler Design', size: '3.3 MB' }], notes: [{ title: 'Parsing Techniques', desc: 'LL and LR parsing' }], youtube: [{ title: 'Compiler Design', channel: 'NPTEL', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Semantic Analysis & Code Generation', aiSummary: 'Semantic analysis, type checking, symbol table. Intermediate code generation (TAC, quadruples). Code optimization and target code generation.', ppts: [{ title: 'Code Generation', size: '2.8 MB' }], notes: [{ title: 'Compiler Phases', desc: 'All phases with examples' }], youtube: [{ title: 'Code Generation', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ],
        7: [
            {
                id: 'softeng-1', key: 'ai', title: 'Software Engineering', code: 'KCS701',
                units: [
                    { title: 'Unit 1: SDLC & Agile', aiSummary: 'Software development life cycle models: waterfall, spiral, incremental. Agile: Scrum framework, sprints, user stories, Kanban. DevOps principles.', ppts: [{ title: 'Software Engineering', size: '3.2 MB' }], notes: [{ title: 'SDLC Models', desc: 'Comparison of models' }], youtube: [{ title: 'Software Engineering', channel: 'NPTEL', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Software Testing', aiSummary: 'Black-box and white-box testing, unit testing, integration testing. Test-driven development (TDD), code coverage, static analysis.', ppts: [{ title: 'Software Testing', size: '2.9 MB' }], notes: [{ title: 'Testing Techniques', desc: 'Testing strategies guide' }], youtube: [{ title: 'Software Testing', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'distributed-1', key: 'cn', title: 'Distributed Systems', code: 'KCS702',
                units: [
                    { title: 'Unit 1: Distributed System Fundamentals', aiSummary: 'Characteristics, transparency, CAP theorem. Remote Procedure Calls (RPC), message passing. Consistency models and replication.', ppts: [{ title: 'Distributed Systems', size: '3.6 MB' }], notes: [{ title: 'CAP Theorem', desc: 'Consistency, Availability, Partition' }], youtube: [{ title: 'Distributed Systems', channel: 'Martin Kleppmann', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Consensus & Fault Tolerance', aiSummary: 'Consensus algorithms: Paxos, Raft. Leader election, Byzantine fault tolerance. MapReduce and distributed data processing (Hadoop, Spark basics).', ppts: [{ title: 'Consensus Algorithms', size: '3.1 MB' }], notes: [{ title: 'Consensus Notes', desc: 'Paxos and Raft explained' }], youtube: [{ title: 'Distributed Consensus', channel: 'MIT OpenCourseWare', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'java-1', key: 'java', title: 'Advanced Java & J2EE', code: 'KCS703',
                units: [
                    { title: 'Unit 1: Core Java Advanced', aiSummary: 'Collections framework, generics, streams API, lambda expressions, multithreading, concurrency utilities. Design patterns in Java.', ppts: [{ title: 'Advanced Java', size: '3.8 MB' }], notes: [{ title: 'Java Collections', desc: 'HashMap, ArrayList, TreeMap' }], youtube: [{ title: 'Advanced Java', channel: 'Derek Banas', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: J2EE & Spring Framework', aiSummary: 'Servlets, JSP, JDBC. Spring Boot: dependency injection, REST APIs, Spring Data JPA, Spring Security basics.', ppts: [{ title: 'Spring Framework', size: '4.2 MB' }], notes: [{ title: 'Spring Boot Guide', desc: 'Annotations and REST' }], youtube: [{ title: 'Spring Boot', channel: 'Amigoscode', url: 'https://youtube.com' }] }
                ]
            }
        ],
        8: [
            {
                id: 'psa-1', key: 'psa', title: 'Project Management', code: 'KCS801',
                units: [
                    { title: 'Unit 1: Project Planning & Risk', aiSummary: 'Project scope, WBS, Gantt charts, PERT/CPM. Risk identification, assessment, and mitigation strategies. Project cost estimation.', ppts: [{ title: 'Project Management', size: '3.0 MB' }], notes: [{ title: 'PM Techniques', desc: 'PERT, CPM and risk methods' }], youtube: [{ title: 'Project Management', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ethics-1', key: 'default', title: 'Professional Ethics & IPR', code: 'KNC801',
                units: [
                    { title: 'Unit 1: Engineering Ethics', aiSummary: 'Professional responsibility, codes of ethics (IEEE, ACM). Intellectual property rights: patents, copyrights, trademarks. Cyber law and IT Act.', ppts: [{ title: 'Ethics & IPR', size: '2.2 MB' }], notes: [{ title: 'Ethics Notes', desc: 'Core ethical principles' }], youtube: [{ title: 'Engineering Ethics', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ]
    },
    'ece': {
        1: [
            {
                id: 'ece-math-1', key: 'math', title: 'Engineering Mathematics I', code: 'KAS101',
                units: [
                    { title: 'Unit 1: Matrices & Determinants', aiSummary: 'Types of matrices, rank, Cayley-Hamilton theorem, eigenvalues and eigenvectors. Essential for circuit analysis and signal processing.', ppts: [{ title: 'Matrices Lecture', size: '3.2 MB' }], notes: [{ title: 'Matrix Formulas', desc: 'All key formulas' }], youtube: [{ title: 'Matrices Complete', channel: 'Dr. Gajendra Purohit', url: 'https://www.youtube.com/watch?v=bwRjC_SRQAI' }] },
                    { title: 'Unit 2: Differential Calculus', aiSummary: 'Successive differentiation, Taylor series, Maclaurin series, partial derivatives and their applications.', ppts: [{ title: 'Calculus Slides', size: '2.8 MB' }], notes: [{ title: 'Calculus Formulas', desc: 'Differentiation rules' }], youtube: [{ title: 'Calculus in One Shot', channel: 'Anurag Chauhan', url: 'https://www.youtube.com/watch?v=HfACrKJ_Y2w' }] }
                ]
            },
            {
                id: 'ece-physics-1', key: 'physics', title: 'Engineering Physics', code: 'KAS102',
                units: [
                    { title: 'Unit 1: Wave Optics & Lasers', aiSummary: 'Interference, diffraction, polarization. Lasers: stimulated emission, He-Ne and semiconductor lasers. Fiber optics and applications.', ppts: [{ title: 'Optics & Lasers', size: '2.1 MB' }], notes: [{ title: 'Optics Notes', desc: 'Derivations and formulas' }], youtube: [{ title: 'Wave Optics', channel: 'Physics Wallah', url: 'https://www.youtube.com/watch?v=6OUEfkGCJpY' }] },
                    { title: 'Unit 2: Semiconductor Physics', aiSummary: 'Energy bands, intrinsic and extrinsic semiconductors, Hall effect, p-n junction physics. Foundation for electronic devices.', ppts: [{ title: 'Semiconductor Physics', size: '2.4 MB' }], notes: [{ title: 'Semiconductor Notes', desc: 'Band theory and devices' }], youtube: [{ title: 'Semiconductor Basics', channel: 'Neso Academy', url: 'https://www.youtube.com/watch?v=pPnIajJ1bUc' }] }
                ]
            },
            {
                id: 'ece-english-1', key: 'english', title: 'Technical Communication', code: 'KAS103',
                units: [
                    { title: 'Unit 1: Communication Skills', aiSummary: 'Technical communication, report writing, presentation skills, business correspondence, grammar essentials.', ppts: [{ title: 'Communication PPT', size: '1.5 MB' }], notes: [{ title: 'Grammar Reference', desc: 'Business letter formats' }], youtube: [{ title: 'Technical Communication', channel: 'Ekeeda', url: 'https://www.youtube.com/watch?v=oBq7YqkG-4Y' }] }
                ]
            }
        ],
        2: [
            {
                id: 'ece-math-2', key: 'math', title: 'Engineering Mathematics II', code: 'KAS201',
                units: [
                    { title: 'Unit 1: Fourier Series & Transforms', aiSummary: 'Fourier series for periodic functions, Fourier transforms, Laplace transforms and their applications in signal analysis.', ppts: [{ title: 'Fourier Analysis', size: '2.5 MB' }], notes: [{ title: 'Transform Pairs', desc: 'Key transform formulas' }], youtube: [{ title: 'Fourier Series', channel: 'Dr. Gajendra Purohit', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ece-bee-1', key: 'bee', title: 'Basic Electrical Engineering', code: 'KEE201',
                units: [
                    { title: 'Unit 1: DC Circuits', aiSummary: 'Ohm\'s law, Kirchhoff\'s laws, mesh and nodal analysis, Thevenin\'s and Norton\'s theorems, superposition principle.', ppts: [{ title: 'DC Circuit Analysis', size: '3.0 MB' }], notes: [{ title: 'Circuit Theorems', desc: 'All key theorems with examples' }], youtube: [{ title: 'Basic Electrical', channel: 'Neso Academy', url: 'https://youtube.com' }] }
                ]
            }
        ],
        3: [
            {
                id: 'ece-signals-1', key: 'signals', title: 'Signals & Systems', code: 'KEC301',
                units: [
                    { title: 'Unit 1: Signal Classification', aiSummary: 'Continuous and discrete time signals. Periodic, aperiodic, energy and power signals. Basic signal operations: shifting, scaling, reversal.', ppts: [{ title: 'Signals & Systems', size: '3.2 MB' }], notes: [{ title: 'Signal Types', desc: 'Classification and operations' }], youtube: [{ title: 'Signals & Systems', channel: 'Neso Academy', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: LTI Systems', aiSummary: 'Linear Time-Invariant systems, convolution, impulse response, BIBO stability, frequency response.', ppts: [{ title: 'LTI Systems', size: '2.8 MB' }], notes: [{ title: 'Convolution Notes', desc: 'Step-by-step methods' }], youtube: [{ title: 'LTI Systems Explained', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ece-digital-1', key: 'micro', title: 'Digital Electronics', code: 'KEC302',
                units: [
                    { title: 'Unit 1: Number Systems & Boolean Algebra', aiSummary: 'Binary, octal, hexadecimal systems. Boolean algebra, De Morgan\'s laws, Karnaugh maps for minimization.', ppts: [{ title: 'Digital Electronics', size: '2.6 MB' }], notes: [{ title: 'K-Map Reference', desc: '2,3,4 variable K-maps' }], youtube: [{ title: 'Digital Electronics', channel: 'Neso Academy', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ece-emft-1', key: 'emft', title: 'Electromagnetic Field Theory', code: 'KEC303',
                units: [
                    { title: 'Unit 1: Electrostatics', aiSummary: 'Coulomb\'s law, Gauss\'s law, electric potential, dielectrics, boundary conditions. Vector calculus: gradient, divergence, curl.', ppts: [{ title: 'EMFT Basics', size: '3.4 MB' }], notes: [{ title: 'Maxwell\'s Equations', desc: 'All four equations explained' }], youtube: [{ title: 'EMFT Full Course', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ],
        4: [
            {
                id: 'ece-analog-1', key: 'emft', title: 'Analog Circuits', code: 'KEC401',
                units: [
                    { title: 'Unit 1: BJT Amplifiers', aiSummary: 'BJT biasing, small-signal model, CE, CB, CC configurations. Frequency response, Miller effect, gain-bandwidth product.', ppts: [{ title: 'Analog Circuits', size: '3.1 MB' }], notes: [{ title: 'Amplifier Notes', desc: 'Configurations and analysis' }], youtube: [{ title: 'Analog Electronics', channel: 'Neso Academy', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ece-comm-1', key: 'signals', title: 'Analog Communication', code: 'KEC402',
                units: [
                    { title: 'Unit 1: Amplitude Modulation', aiSummary: 'AM, DSB-SC, SSB modulation and demodulation. Frequency spectrum, bandwidth, power analysis, AM radio systems.', ppts: [{ title: 'Analog Comm', size: '2.9 MB' }], notes: [{ title: 'Modulation Summary', desc: 'Types and key formulas' }], youtube: [{ title: 'Analog Communication', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ]
    },
    'me': {
        1: [
            {
                id: 'me-math-1', key: 'math', title: 'Engineering Mathematics I', code: 'KAS101',
                units: [
                    { title: 'Unit 1: Matrices & Differential Calculus', aiSummary: 'Matrix operations, eigenvalues, successive differentiation, Taylor series. Foundation for engineering analysis.', ppts: [{ title: 'Math Lecture', size: '3.2 MB' }], notes: [{ title: 'Math Formulas', desc: 'Key formulas' }], youtube: [{ title: 'Engineering Math', channel: 'Dr. Gajendra Purohit', url: 'https://www.youtube.com/watch?v=bwRjC_SRQAI' }] }
                ]
            },
            {
                id: 'me-physics-1', key: 'physics', title: 'Engineering Physics', code: 'KAS102',
                units: [
                    { title: 'Unit 1: Wave Mechanics & Thermodynamics', aiSummary: 'Oscillations, wave motion, laws of thermodynamics, entropy, heat engines. Direct application in mechanical engineering.', ppts: [{ title: 'Physics Lecture', size: '2.1 MB' }], notes: [{ title: 'Thermo Notes', desc: 'Laws and equations' }], youtube: [{ title: 'Engineering Physics', channel: 'Physics Wallah', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'me-engg-drawing-1', key: 'or', title: 'Engineering Drawing', code: 'KME151',
                units: [
                    { title: 'Unit 1: Orthographic Projections', aiSummary: 'First and third angle projections, principal planes, drawing of solids (prisms, cylinders, cones). Essential drafting skill.', ppts: [{ title: 'Engineering Drawing', size: '4.0 MB' }], notes: [{ title: 'Drawing Standards', desc: 'BIS standards and conventions' }], youtube: [{ title: 'Engineering Drawing', channel: 'Gate Smashers', url: 'https://youtube.com' }] }
                ]
            }
        ],
        2: [
            {
                id: 'me-math-2', key: 'math', title: 'Engineering Mathematics II', code: 'KAS201',
                units: [
                    { title: 'Unit 1: Integral Calculus & ODE', aiSummary: 'Multiple integrals, line and surface integrals, ordinary differential equations and their engineering applications.', ppts: [{ title: 'Integral Calculus', size: '2.5 MB' }], notes: [{ title: 'ODE Methods', desc: 'Solving techniques' }], youtube: [{ title: 'Engineering Calculus', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'me-som-1', key: 'som', title: 'Engineering Mechanics', code: 'KME201',
                units: [
                    { title: 'Unit 1: Statics & Forces', aiSummary: 'Concurrent and non-concurrent forces, moment of a force, conditions of equilibrium, free body diagrams. Lami\'s theorem.', ppts: [{ title: 'Engineering Mechanics', size: '3.5 MB' }], notes: [{ title: 'Statics Notes', desc: 'Equilibrium conditions' }], youtube: [{ title: 'Engineering Mechanics', channel: 'Gate Smashers', url: 'https://youtube.com' }] }
                ]
            }
        ],
        3: [
            {
                id: 'me-thermo-1', key: 'thermo', title: 'Thermodynamics', code: 'KME301',
                units: [
                    { title: 'Unit 1: Laws of Thermodynamics', aiSummary: 'Zeroth, first, second, and third laws. Thermodynamic systems, processes, cycles. Concept of entropy and availability.', ppts: [{ title: 'Thermodynamics', size: '3.6 MB' }], notes: [{ title: 'Thermo Laws', desc: 'All four laws explained' }], youtube: [{ title: 'Thermodynamics', channel: 'NPTEL', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Power Cycles', aiSummary: 'Carnot, Rankine, Otto, Diesel, Brayton cycles. Efficiency calculations, p-v and T-s diagrams. Steam power plants.', ppts: [{ title: 'Power Cycles PPT', size: '2.9 MB' }], notes: [{ title: 'Cycle Efficiency', desc: 'Formulas and comparisons' }], youtube: [{ title: 'Thermodynamic Cycles', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'me-fluid-1', key: 'fluid', title: 'Fluid Mechanics', code: 'KME302',
                units: [
                    { title: 'Unit 1: Fluid Properties & Statics', aiSummary: 'Viscosity, surface tension, capillarity. Hydrostatic pressure, Pascal\'s law, pressure measurement, buoyancy and Archimedes\' principle.', ppts: [{ title: 'Fluid Mechanics', size: '3.2 MB' }], notes: [{ title: 'Fluid Properties', desc: 'Key equations' }], youtube: [{ title: 'Fluid Mechanics', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'me-som-2', key: 'som', title: 'Strength of Materials', code: 'KME303',
                units: [
                    { title: 'Unit 1: Stress & Strain', aiSummary: 'Normal and shear stress, elastic constants, Hooke\'s law, Poisson\'s ratio, principle of superposition. Compound stresses.', ppts: [{ title: 'SOM Basics', size: '3.0 MB' }], notes: [{ title: 'Stress-Strain Notes', desc: 'Elastic constants' }], youtube: [{ title: 'Strength of Materials', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ],
        4: [
            {
                id: 'me-mfg-1', key: 'or', title: 'Manufacturing Science', code: 'KME401',
                units: [
                    { title: 'Unit 1: Casting & Welding', aiSummary: 'Sand casting process, patterns, molds. Arc welding, gas welding, resistance welding. Defects and inspection methods.', ppts: [{ title: 'Manufacturing Processes', size: '3.8 MB' }], notes: [{ title: 'Manufacturing Notes', desc: 'Processes and defects' }], youtube: [{ title: 'Manufacturing Science', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'me-md-1', key: 'som', title: 'Machine Design', code: 'KME402',
                units: [
                    { title: 'Unit 1: Design Philosophy & Loads', aiSummary: 'Factor of safety, design for static and dynamic loads, stress concentration, theories of failure (maximum principal stress, distortion energy).', ppts: [{ title: 'Machine Design', size: '3.3 MB' }], notes: [{ title: 'Design Criteria', desc: 'Failure theories' }], youtube: [{ title: 'Machine Design', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ]
    },
    'ce': {
        1: [
            {
                id: 'ce-math-1', key: 'math', title: 'Engineering Mathematics I', code: 'KAS101',
                units: [
                    { title: 'Unit 1: Matrices & Calculus', aiSummary: 'Matrix methods, eigenvalues. Differential and integral calculus applied to civil engineering problems.', ppts: [{ title: 'Math Lecture', size: '3.2 MB' }], notes: [{ title: 'Math Formulas', desc: 'Key formulas' }], youtube: [{ title: 'Engineering Math', channel: 'Dr. Gajendra Purohit', url: 'https://www.youtube.com/watch?v=bwRjC_SRQAI' }] }
                ]
            },
            {
                id: 'ce-physics-1', key: 'physics', title: 'Engineering Physics', code: 'KAS102',
                units: [
                    { title: 'Unit 1: Mechanics & Properties of Matter', aiSummary: 'Elasticity, viscosity, surface tension. Direct relevance to structural analysis and material selection.', ppts: [{ title: 'Physics Lecture', size: '2.1 MB' }], notes: [{ title: 'Material Properties', desc: 'Key equations' }], youtube: [{ title: 'Engineering Physics', channel: 'Physics Wallah', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ce-engg-drawing-1', key: 'survey', title: 'Engineering Drawing', code: 'KCE151',
                units: [
                    { title: 'Unit 1: Orthographic Projections', aiSummary: 'First and third angle projections, sectional views, isometric drawings. Foundation for structural and architectural drawings.', ppts: [{ title: 'Engineering Drawing', size: '4.0 MB' }], notes: [{ title: 'Drawing Standards', desc: 'BIS conventions' }], youtube: [{ title: 'Engineering Drawing', channel: 'Gate Smashers', url: 'https://youtube.com' }] }
                ]
            }
        ],
        2: [
            {
                id: 'ce-math-2', key: 'math', title: 'Engineering Mathematics II', code: 'KAS201',
                units: [
                    { title: 'Unit 1: Differential Equations & Transforms', aiSummary: 'ODE, PDE applied to structural vibrations. Fourier and Laplace transforms for civil engineering analysis.', ppts: [{ title: 'Math II Lecture', size: '2.5 MB' }], notes: [{ title: 'ODE Reference', desc: 'Solution methods' }], youtube: [{ title: 'Math II', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ce-mech-1', key: 'som', title: 'Engineering Mechanics', code: 'KCE201',
                units: [
                    { title: 'Unit 1: Statics of Structures', aiSummary: 'Forces, resultants, equilibrium. Analysis of trusses using method of joints and sections. Free body diagrams.', ppts: [{ title: 'Engineering Mechanics', size: '3.5 MB' }], notes: [{ title: 'Statics Notes', desc: 'Truss analysis' }], youtube: [{ title: 'Engineering Mechanics', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ],
        3: [
            {
                id: 'ce-struct-1', key: 'som', title: 'Structural Analysis', code: 'KCE301',
                units: [
                    { title: 'Unit 1: Determinate Structures', aiSummary: 'Bending moment and shear force diagrams for beams. Influence lines, deflection of beams, moment-area method.', ppts: [{ title: 'Structural Analysis', size: '3.8 MB' }], notes: [{ title: 'BMD & SFD Guide', desc: 'Step-by-step diagrams' }], youtube: [{ title: 'Structural Analysis', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ce-concrete-1', key: 'concrete', title: 'Concrete Technology', code: 'KCE302',
                units: [
                    { title: 'Unit 1: Cement & Concrete', aiSummary: 'Types of cement, hydration process, water-cement ratio, workability, mix design (IS method), strength development of concrete.', ppts: [{ title: 'Concrete Technology', size: '3.2 MB' }], notes: [{ title: 'Mix Design Notes', desc: 'IS method and properties' }], youtube: [{ title: 'Concrete Technology', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ce-survey-1', key: 'survey', title: 'Surveying', code: 'KCE303',
                units: [
                    { title: 'Unit 1: Chain & Compass Surveying', aiSummary: 'Principles of surveying, chain surveying, compass traversing, theodolite surveying. Error correction and adjustment.', ppts: [{ title: 'Surveying Basics', size: '2.9 MB' }], notes: [{ title: 'Survey Methods', desc: 'Instruments and procedures' }], youtube: [{ title: 'Surveying', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ],
        4: [
            {
                id: 'ce-rcc-1', key: 'concrete', title: 'Design of RCC Structures', code: 'KCE401',
                units: [
                    { title: 'Unit 1: Limit State Design', aiSummary: 'IS 456 code provisions, limit state of collapse and serviceability. Design of beams, slabs for flexure and shear.', ppts: [{ title: 'RCC Design', size: '4.0 MB' }], notes: [{ title: 'RCC Design Notes', desc: 'IS code and design steps' }], youtube: [{ title: 'RCC Design', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ce-fluid-1', key: 'fluid', title: 'Fluid Mechanics & Hydraulics', code: 'KCE402',
                units: [
                    { title: 'Unit 1: Fluid Properties & Flow', aiSummary: 'Continuity equation, Bernoulli\'s equation, flow measurement, pipe flow, open channel flow. Manning\'s and Chezy\'s equations.', ppts: [{ title: 'Fluid Mechanics', size: '3.1 MB' }], notes: [{ title: 'Flow Equations', desc: 'Key hydraulic formulas' }], youtube: [{ title: 'Fluid Mechanics', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ]
    },
    'ee': {
        1: [
            {
                id: 'ee-math-1', key: 'math', title: 'Engineering Mathematics I', code: 'KAS101',
                units: [
                    { title: 'Unit 1: Matrices & Differential Calculus', aiSummary: 'Matrix operations, eigenvalues. Differential calculus for engineering analysis. Foundation for electrical circuit analysis.', ppts: [{ title: 'Math Lecture', size: '3.2 MB' }], notes: [{ title: 'Math Formulas', desc: 'Key formulas' }], youtube: [{ title: 'Engineering Math', channel: 'Dr. Gajendra Purohit', url: 'https://www.youtube.com/watch?v=bwRjC_SRQAI' }] }
                ]
            },
            {
                id: 'ee-physics-1', key: 'physics', title: 'Engineering Physics', code: 'KAS102',
                units: [
                    { title: 'Unit 1: Electromagnetic Theory Basics', aiSummary: 'Electric and magnetic fields, Maxwell\'s equations in integral form. Electromagnetic induction and its applications.', ppts: [{ title: 'Physics Lecture', size: '2.1 MB' }], notes: [{ title: 'EM Notes', desc: 'Faraday and Maxwell' }], youtube: [{ title: 'Engineering Physics', channel: 'Physics Wallah', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ee-bee-1', key: 'bee', title: 'Basic Electrical Engineering', code: 'KEE101',
                units: [
                    { title: 'Unit 1: DC Circuit Analysis', aiSummary: 'Ohm\'s law, KVL, KCL. Mesh and nodal analysis. Thevenin\'s, Norton\'s, superposition, maximum power transfer theorems.', ppts: [{ title: 'BEE Lecture', size: '3.0 MB' }], notes: [{ title: 'Circuit Theorems', desc: 'All key theorems' }], youtube: [{ title: 'Basic Electrical', channel: 'Neso Academy', url: 'https://youtube.com' }] }
                ]
            }
        ],
        2: [
            {
                id: 'ee-math-2', key: 'math', title: 'Engineering Mathematics II', code: 'KAS201',
                units: [
                    { title: 'Unit 1: Complex Analysis & Transforms', aiSummary: 'Complex functions, contour integration, Laplace and Fourier transforms. Essential for circuit analysis and signal processing.', ppts: [{ title: 'Complex Analysis', size: '2.5 MB' }], notes: [{ title: 'Transform Pairs', desc: 'Laplace and Fourier tables' }], youtube: [{ title: 'Complex Analysis', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ee-network-1', key: 'pse', title: 'Network Theory', code: 'KEE201',
                units: [
                    { title: 'Unit 1: AC Circuit Analysis', aiSummary: 'Phasors, impedance, resonance, power factor. Series and parallel RLC circuits. Power in AC circuits: active, reactive, apparent.', ppts: [{ title: 'Network Theory', size: '3.2 MB' }], notes: [{ title: 'AC Circuit Notes', desc: 'Phasor and power analysis' }], youtube: [{ title: 'Network Theory', channel: 'Neso Academy', url: 'https://youtube.com' }] }
                ]
            }
        ],
        3: [
            {
                id: 'ee-machines-1', key: 'machines', title: 'Electrical Machines I', code: 'KEE301',
                units: [
                    { title: 'Unit 1: DC Machines', aiSummary: 'DC generator and motor construction, EMF equation, armature reaction, commutation. Speed-torque characteristics and efficiency.', ppts: [{ title: 'DC Machines', size: '3.8 MB' }], notes: [{ title: 'DC Machine Equations', desc: 'EMF and torque equations' }], youtube: [{ title: 'Electrical Machines', channel: 'NPTEL', url: 'https://youtube.com' }] },
                    { title: 'Unit 2: Transformers', aiSummary: 'Transformer principle, EMF equation, equivalent circuit, losses, efficiency, voltage regulation. All-day efficiency and auto-transformer.', ppts: [{ title: 'Transformer PPT', size: '3.0 MB' }], notes: [{ title: 'Transformer Notes', desc: 'Tests and efficiency' }], youtube: [{ title: 'Transformers', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ee-power-1', key: 'pse', title: 'Power Systems I', code: 'KEE302',
                units: [
                    { title: 'Unit 1: Power System Fundamentals', aiSummary: 'Structure of power system, per-unit system, overhead line conductors, underground cables. Sag and tension calculations.', ppts: [{ title: 'Power Systems', size: '3.5 MB' }], notes: [{ title: 'Per-Unit System', desc: 'Base quantities and examples' }], youtube: [{ title: 'Power Systems', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ee-control-1', key: 'emft', title: 'Control Systems', code: 'KEE303',
                units: [
                    { title: 'Unit 1: Open and Closed Loop Systems', aiSummary: 'Transfer functions, block diagram reduction, signal flow graphs. Mason\'s gain formula. Steady-state error and types of systems.', ppts: [{ title: 'Control Systems', size: '3.4 MB' }], notes: [{ title: 'Block Diagram Rules', desc: 'Reduction techniques' }], youtube: [{ title: 'Control Systems', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ],
        4: [
            {
                id: 'ee-machines-2', key: 'machines', title: 'Electrical Machines II', code: 'KEE401',
                units: [
                    { title: 'Unit 1: Induction Motors', aiSummary: 'Three-phase induction motor: rotating magnetic field, slip, torque equation, equivalent circuit, starting methods, speed control.', ppts: [{ title: 'Induction Motor', size: '3.6 MB' }], notes: [{ title: 'Induction Motor Notes', desc: 'Torque-slip characteristics' }], youtube: [{ title: 'Induction Motors', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            },
            {
                id: 'ee-pe-1', key: 'pse', title: 'Power Electronics', code: 'KEE402',
                units: [
                    { title: 'Unit 1: Power Semiconductor Devices', aiSummary: 'SCR, MOSFET, IGBT characteristics and triggering. Controlled rectifiers: half-wave and full-wave. Firing angle and ripple factor.', ppts: [{ title: 'Power Electronics', size: '3.7 MB' }], notes: [{ title: 'Power Devices', desc: 'Characteristics and circuits' }], youtube: [{ title: 'Power Electronics', channel: 'NPTEL', url: 'https://youtube.com' }] }
                ]
            }
        ]
    }
};

export const quizzes = {
    'dsa-1': [
        { id: 'q1', question: 'Which data structure uses LIFO principle?', options: ['Queue', 'Linked List', 'Stack', 'Tree'], correctAnswer: 2, explanation: 'Stack follows Last In First Out (LIFO) principle.' },
        { id: 'q2', question: 'What is the worst-case time complexity of QuickSort?', options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], correctAnswer: 1, explanation: 'QuickSort is O(n²) in the worst case when the pivot is always the smallest or largest element.' },
        { id: 'q3', question: 'BFS uses which data structure?', options: ['Stack', 'Queue', 'Array', 'Heap'], correctAnswer: 1, explanation: 'Breadth-First Search uses a Queue for its implementation.' }
    ],
    'dbms-1': [
        { id: 'q1', question: 'Which normal form removes transitive dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: 2, explanation: '3NF removes transitive dependencies.' }
    ],
    'os-1': [
        { id: 'q1', question: 'Round Robin scheduling is best for:', options: ['Batch systems', 'Time-sharing systems', 'Real-time systems', 'Embedded systems'], correctAnswer: 1, explanation: 'Round Robin is designed for time-sharing systems to provide fair CPU allocation.' }
    ]
};

export const yearToSemesters = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8]
};
