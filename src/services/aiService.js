// src/services/aiService.js
class AIService {
  constructor() {
    this.apiKey = localStorage.getItem('studynest_openrouter_key') || import.meta.env.VITE_OPENROUTER_KEY || '';
    // Primary free model (April 2026)
    this.model = 'openai/gpt-oss-120b:free';
    
    const maskedKey = this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NONE';
    console.log('AIService initialized');
    console.log('Default Model:', this.model);
    console.log('API Key:', maskedKey);
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('studynest_openrouter_key', key);
  }

  hasApiKey() {
    return !!this.apiKey;
  }

  async callAI(messages, systemPrompt = '') {
    // Simulated delay for "realism"
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock responses for 2nd Year 4th Sem
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (userMessage.includes('graph algorithms') || userMessage.includes('dsa-ii')) {
      if (systemPrompt.includes('summary')) {
        return `### Comprehensive AI Overview: Data Structures & Algorithms II
This subject focuses on advanced algorithmic techniques, particularly graph-based solutions and complex data structures.

**Key Units & Concepts:**
1. **Graph Fundamentals**: Understanding V, E, and degree properties.
2. **Traversals**: BFS for shortest path in unweighted graphs; DFS for connectivity and topological sorting.
3. **Spanning Trees**: Prim's (vertex-based) and Kruskal's (edge-based) algorithms for MST.
4. **Shortest Paths**: Dijkstra's algorithm (Greedy approach) and Bellman-Ford (Dynamic Programming).
5. **Advanced Topics**: Flow networks, matching, and NP-completeness.

**Essential Formulas:**
- Handshaking Lemma: Σ deg(v) = 2|E|.
- Dijkstra Complexity with Fibonacci Heap: O(E + V log V).
- Kruskal Complexity: O(E log E) or O(E log V).

**Exam Strategy:**
Master the step-by-step execution of Dijkstra and Prim's. Theoretical questions often focus on comparing different algorithm paradigms (Greedy vs DP).`;
      }
      if (systemPrompt.includes('notes')) {
        return `### Revision Notes: Graph Algorithms
- **Graph Representation**:
  - Adjacency Matrix: Best for dense graphs, O(1) edge lookup.
  - Adjacency List: Best for sparse graphs, O(V+E) space.
- **BFS (Breadth-First Search)**:
  - Uses Queue.
  - Finds shortest path in unweighted graphs.
  - Level-order traversal.
- **DFS (Depth-First Search)**:
  - Uses Stack/Recursion.
  - Detects cycles in directed/undirected graphs.
- **MST (Minimum Spanning Tree)**:
  - A subgraph with all vertices and minimum total edge weight.
  - No cycles.`;
      }
      if (systemPrompt.includes('qa pairs')) {
        return `Q1: Define a Spanning Tree.
Answer: A spanning tree of a graph is a subgraph that includes all vertices of the original graph and is a tree (connected and acyclic).

Q2: What is the difference between BFS and DFS?
Answer: BFS explores neighbors first using a queue (level-by-level), while DFS explores as deep as possible along each branch before backtracking using a stack.

Q3: When does Dijkstra's algorithm fail?
Answer: It fails when the graph contains negative edge weights.`;
      }
      if (systemPrompt.includes('multiple-choice questions')) {
        const isSubject = systemPrompt.includes('comprehensive');
        const count = isSubject ? 10 : 5;
        const baseMcqs = [
          { "question": "Which data structure is used in BFS?", "options": ["Stack", "Queue", "Heap", "Tree"], "correctAnswer": 1, "explanation": "BFS uses a Queue to keep track of the next vertices to visit." },
          { "question": "What is the time complexity of Kruskal's algorithm?", "options": ["O(V^2)", "O(E log E)", "O(V+E)", "O(E^2)"], "correctAnswer": 1, "explanation": "Kruskal's algorithm takes O(E log E) time mainly due to sorting the edges." },
          { "question": "Dijkstra's algorithm cannot handle which type of edges?", "options": ["Positive weights", "Zero weights", "Negative weights", "Floating weights"], "correctAnswer": 2, "explanation": "Dijkstra's algorithm assumes non-negative edge weights for its greedy approach to work." },
          { "question": "A graph with no cycles is called:", "options": ["Acyclic", "Bipartite", "Complete", "Connected"], "correctAnswer": 0, "explanation": "An acyclic graph is a graph that contains no cycles." },
          { "question": "Which algorithm is vertex-based for finding MST?", "options": ["Kruskal's", "Prim's", "Dijkstra's", "Bellman-Ford"], "correctAnswer": 1, "explanation": "Prim's algorithm builds the MST by adding vertices one by one." },
          { "question": "What is the maximum number of edges in a simple graph with V vertices?", "options": ["V(V-1)/2", "V^2", "2V", "V-1"], "correctAnswer": 0, "explanation": "A complete graph K_v has V(V-1)/2 edges." },
          { "question": "Which traversal is used for Topological Sorting?", "options": ["BFS", "DFS", "Level Order", "Inorder"], "correctAnswer": 1, "explanation": "Topological sort is typically implemented using DFS by pushing finished nodes onto a stack." },
          { "question": "The Handshaking Lemma states that the sum of degrees is:", "options": ["Number of edges", "2 * Number of edges", "V - 1", "V / 2"], "correctAnswer": 1, "explanation": "Each edge contributes twice to the total sum of degrees." },
          { "question": "Bellman-Ford algorithm is used to find:", "options": ["MST", "All-pairs shortest path", "Single-source shortest path with negative weights", "Maximum flow"], "correctAnswer": 2, "explanation": "Bellman-Ford handles negative weights and detects negative cycles." },
          { "question": "In an adjacency matrix, checking if an edge exists takes:", "options": ["O(1)", "O(V)", "O(E)", "O(log V)"], "correctAnswer": 0, "explanation": "An adjacency matrix allows O(1) lookup of any edge (i, j)." }
        ];
        return JSON.stringify(baseMcqs.slice(0, count));
      }
    }

    if (userMessage.includes('er modeling') || userMessage.includes('dbms')) {
      if (systemPrompt.includes('summary')) {
        return `### Comprehensive AI Overview: Database Management Systems
DBMS is a collection of programs that enables users to create and maintain a database.

**Key Units & Concepts:**
1. **Data Models**: ER Model (Conceptual), Relational Model (Logical).
2. **Relational Algebra**: Selection, Projection, Join, Union.
3. **SQL**: DDL (Create, Drop), DML (Insert, Select, Update), DCL (Grant, Revoke).
4. **Normalization**: Eliminating data redundancy (1NF, 2NF, 3NF, BCNF).
5. **Transactions**: ACID properties (Atomicity, Consistency, Isolation, Durability).

**Relational Rules:**
- Primary Key: Unique identifier, cannot be null.
- Foreign Key: Ensures referential integrity.
- Functional Dependency: X -> Y means X determines Y.

**Exam Strategy:**
Be proficient in converting ER diagrams to Relational Tables. SQL query writing and Normalization steps are mandatory for high scores.`;
      }
      if (systemPrompt.includes('notes')) {
        return `### Revision Notes: DBMS Essentials
- **ACID Properties**:
  - Atomicity: All or nothing.
  - Consistency: Valid state before and after.
  - Isolation: Concurrent transactions don't interfere.
  - Durability: Changes are permanent.
- **Normalization**:
  - 1NF: Atomic values.
  - 2NF: No partial dependency.
  - 3NF: No transitive dependency.
  - BCNF: For every X->Y, X is a super key.
- **Joins**:
  - Inner Join: Matching rows only.
  - Left Join: All from left + matches from right.`;
      }
      if (systemPrompt.includes('qa pairs')) {
        return `Q1: What is a Primary Key?
Answer: A primary key is a minimal set of attributes that uniquely identifies a tuple in a relation. It cannot contain null values.

Q2: Explain the difference between DELETE and TRUNCATE.
Answer: DELETE is a DML command that can be rolled back and removes rows one by one. TRUNCATE is a DDL command that removes all rows and cannot be rolled back easily.

Q3: What is a View?
Answer: A view is a virtual table based on the result-set of an SQL statement. It doesn't store data itself.`;
      }
      if (systemPrompt.includes('multiple-choice questions')) {
        const isSubject = systemPrompt.includes('comprehensive');
        const count = isSubject ? 10 : 5;
        const baseMcqs = [
          { "question": "Which normal form removes transitive dependencies?", "options": ["1NF", "2NF", "3NF", "BCNF"], "correctAnswer": 2, "explanation": "3NF ensures that all non-key attributes are functionally dependent only on the primary key." },
          { "question": "What represents a weak entity in an ER diagram?", "options": ["Rectangle", "Diamond", "Double Rectangle", "Ellipse"], "correctAnswer": 2, "explanation": "Weak entities are represented by double-lined rectangles." },
          { "question": "A multivalued attribute is represented by:", "options": ["Dashed Ellipse", "Double Ellipse", "Underlined Ellipse", "Rectangle"], "correctAnswer": 1, "explanation": "Double ellipses are used for multivalued attributes like Phone Numbers." },
          { "question": "In SQL, which clause is used to filter group results?", "options": ["WHERE", "FILTER", "HAVING", "GROUP BY"], "correctAnswer": 2, "explanation": "HAVING is used to filter results after the GROUP BY clause." },
          { "question": "The 'I' in ACID stands for:", "options": ["Integrity", "Isolation", "Indexing", "Iteration"], "correctAnswer": 1, "explanation": "Isolation ensures that concurrent transactions result in a system state as if transactions were executed serially." },
          { "question": "Which join returns all rows from the left table and matched rows from the right?", "options": ["Inner Join", "Right Join", "Left Join", "Full Join"], "correctAnswer": 2, "explanation": "Left Join (or Left Outer Join) returns all records from the left table." },
          { "question": "A primary key must be:", "options": ["Unique", "Not Null", "Both Unique and Not Null", "Auto-incremented"], "correctAnswer": 2, "explanation": "Primary keys must uniquely identify a row and cannot contain NULL values." },
          { "question": "Which level of abstraction describes HOW data is stored?", "options": ["Physical Level", "Logical Level", "View Level", "Conceptual Level"], "correctAnswer": 0, "explanation": "The physical level is the lowest level of data abstraction." },
          { "question": "Data redundancy leads to:", "options": ["Data Integrity", "Efficient Storage", "Anomalies", "Security"], "correctAnswer": 2, "explanation": "Redundancy causes insertion, deletion, and update anomalies." },
          { "question": "What command is used to remove a table from the database?", "options": ["DELETE", "REMOVE", "DROP", "TRUNCATE"], "correctAnswer": 2, "explanation": "DROP TABLE is used to remove the table structure and its data." }
        ];
        return JSON.stringify(baseMcqs.slice(0, count));
      }
    }

    if (userMessage.includes('introduction to os') || userMessage.includes('operating systems')) {
      if (systemPrompt.includes('summary')) {
        return `### Comprehensive AI Overview: Operating Systems
An OS is the software that manages computer hardware and software resources.

**Key Units & Concepts:**
1. **Process Management**: Schedulers (Long, Medium, Short-term), PCB, Context Switch.
2. **CPU Scheduling**: Preemptive vs Non-preemptive algorithms.
3. **Deadlocks**: Necessary conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait).
4. **Memory Management**: Swapping, Paging, Segmentation, Fragmentation (Internal/External).
5. **Storage Management**: Disk scheduling (FCFS, SSTF, SCAN, C-SCAN).

**Performance Formulas:**
- CPU Utilization: Total time CPU is busy.
- Throughput: Processes completed per unit time.
- Turnaround Time: Completion Time - Arrival Time.

**Exam Strategy:**
Be prepared for Gantt chart numericals on Round Robin and SRTF. Deadlock avoidance (Banker's Algorithm) is a recurring high-weightage topic.`;
      }
      if (systemPrompt.includes('notes')) {
        return `### Revision Notes: OS Fundamentals
- **Process States**: New, Ready, Running, Waiting, Terminated.
- **CPU Scheduling**:
  - FCFS: Simple, Convoy effect.
  - SJF: Optimal average waiting time.
  - Round Robin: Time-sharing, uses time quantum.
- **Deadlock Conditions**:
  1. Mutual Exclusion
  2. Hold and Wait
  3. No Preemption
  4. Circular Wait
- **Virtual Memory**: Allows execution of processes not completely in memory using Demand Paging.`;
      }
      if (systemPrompt.includes('qa pairs')) {
        return `Q1: What is a System Call?
Answer: A system call is a programmatic way in which a computer program requests a service from the kernel of the operating system.

Q2: Explain Thrashing.
Answer: Thrashing occurs when a system spends more time swapping pages in and out of memory than executing processes, usually due to low physical memory.

Q3: Difference between Paging and Segmentation.
Answer: Paging divides memory into fixed-size blocks (pages/frames), while segmentation divides memory into logical units (segments) of varying sizes.`;
      }
      if (systemPrompt.includes('multiple-choice questions')) {
        const isSubject = systemPrompt.includes('comprehensive');
        const count = isSubject ? 10 : 5;
        const baseMcqs = [
          { "question": "Which scheduling algorithm can lead to starvation?", "options": ["Round Robin", "FCFS", "SJF", "Multilevel Queue"], "correctAnswer": 2, "explanation": "Shortest Job First (SJF) can cause starvation for long processes if short processes keep arriving." },
          { "question": "What is a PCB?", "options": ["Process Control Block", "Process Central Board", "Program Control Block", "Personal Computer Board"], "correctAnswer": 0, "explanation": "PCB stores all information about a process, including state and PC." },
          { "question": "The Banker's Algorithm is used for:", "options": ["Deadlock Prevention", "Deadlock Avoidance", "Deadlock Detection", "Memory Allocation"], "correctAnswer": 1, "explanation": "Banker's Algorithm is a classic deadlock avoidance algorithm." },
          { "question": "Which component of the OS is responsible for process scheduling?", "options": ["Kernel", "Shell", "Dispatcher", "Compiler"], "correctAnswer": 0, "explanation": "The scheduler (part of the kernel) decides which process runs." },
          { "question": "Virtual memory is typically implemented by:", "options": ["Segmentation", "Demand Paging", "Swapping", "Fragmentation"], "correctAnswer": 1, "explanation": "Demand paging is the most common way to implement virtual memory." },
          { "question": "A mutex is a:", "options": ["Type of thread", "Synchronization tool", "Scheduling algorithm", "Memory management unit"], "correctAnswer": 1, "explanation": "A Mutex (Mutual Exclusion) object is used to synchronize access to a resource." },
          { "question": "Which page replacement algorithm suffers from Belady's Anomaly?", "options": ["LRU", "FIFO", "Optimal", "LFU"], "correctAnswer": 1, "explanation": "First-In-First-Out (FIFO) can show increased page faults with more frames." },
          { "question": "The 'Ready' state of a process means:", "options": ["It is waiting for I/O", "It is being created", "It is in memory and waiting for CPU", "It has finished execution"], "correctAnswer": 2, "explanation": "Processes in the ready state are in main memory, waiting to be assigned to a CPU." },
          { "question": "What is context switching?", "options": ["Switching between users", "Saving and restoring process state", "Changing CPU speed", "Switching between RAM and Disk"], "correctAnswer": 1, "explanation": "Context switching is the process of storing the state of a process so it can be resumed later." },
          { "question": "In disk scheduling, SSTF stands for:", "options": ["Shortest Service Time First", "Shortest Seek Time First", "Sequential Service Time First", "Single Seek Time First"], "correctAnswer": 1, "explanation": "Shortest Seek Time First selects the request with the minimum seek time from the current head position." }
        ];
        return JSON.stringify(baseMcqs.slice(0, count));
      }
    }

    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const fullMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    // Valid free models on OpenRouter as of April 2026
    const modelsToTry = [
      this.model,                                  // google/gemma-4-31b-it:free
      'openai/gpt-oss-120b:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
      'minimax/minimax-m2.5:free',
      'nvidia/nemotron-nano-9b-v2:free',
      'nvidia/nemotron-3-nano-30b-a3b:free'
    ];

    let lastError;

    for (const modelId of modelsToTry) {
      try {
        console.log(`Attempting AI call with model: ${modelId}`);
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://studynest.edu', 
            'X-Title': 'StudyNest'
          },
          body: JSON.stringify({
            model: modelId,
            messages: fullMessages,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const error = await response.json();
          const errorMsg = error.error?.message || 'API request failed';
          const lowerError = errorMsg.toLowerCase();
          
          // Detect temporary or model-specific errors to trigger fallback
          const isFallbackTrigger = 
            response.status >= 500 || 
            response.status === 400 || 
            response.status === 404 ||
            lowerError.includes('provider') || 
            lowerError.includes('capacity') || 
            lowerError.includes('timeout') ||
            lowerError.includes('model') || 
            lowerError.includes('endpoint') || 
            lowerError.includes('overloaded');

          if (isFallbackTrigger) {
            console.warn(`Model ${modelId} failed: ${errorMsg}. Trying fallback...`);
            throw new Error(errorMsg);
          }
          
          // Only stop for definitive critical errors (like invalid auth)
          throw new Error(`CRITICAL: ${errorMsg}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

      } catch (e) {
        lastError = e;
        
        // If it was explicitly marked as critical, stop the loop
        if (e.message.startsWith('CRITICAL:')) {
          throw new Error(e.message.replace('CRITICAL: ', ''));
        }
        
        console.log(`Switching from ${modelId} due to error...`);
        continue;
      }
    }

    throw new Error(`AI generation failed after trying ${modelsToTry.length} models. Last error: ${lastError.message}`);
  }

  async generateNotes(content, unitTitle) {
    const systemPrompt = `You are an expert engineering professor. Generate concise, exam-focused revision notes.
Format: Use bullet points with clear headings. Include formulas and key concepts. Keep suitable for last-minute revision.`;

    const userMessage = `Generate revision notes for: ${unitTitle}\n\nContent:\n${content}`;
    return await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
  }

  async generateQA(content, minQuestions = 5) {
    const systemPrompt = `You are an expert engineering professor. Generate exam-oriented Q&A pairs.
Format: Mix of conceptual and numerical questions with detailed answers. Include formulas where relevant.`;

    const userMessage = `Generate at least ${minQuestions} Q&A pairs:\n\n${content}`;
    return await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
  }

  async generateSummary(content) {
    const systemPrompt = `You are an expert engineering professor. Create a highly detailed, comprehensive summary of the provided content. 
Structure the summary into:
1. Overview: High-level explanation of the topic.
2. Key Concepts: Definitions of crucial terms.
3. Formulas & Equations: List all important mathematical relations with variable definitions.
4. Exam Tips: What students should focus on for finals.
Use Markdown formatting for clarity.`;

    const userMessage = `Summarize this engineering unit content thoroughly:\n\n${content}`;
    return await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
  }

  async generateQuiz(content, numQuestions = 5) {
    const systemPrompt = `You are an expert engineering professor. Generate a set of ${numQuestions} multiple-choice questions based on the provided content.
Return the result ONLY as a valid JSON array of objects. Each object must have:
- question: The question text.
- options: An array of 4 strings (options).
- correctAnswer: The index (0-3) of the correct option.
- explanation: A brief explanation of why that option is correct.

Example structure:
[
  {
    "question": "What is...?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Because..."
  }
]`;

    const userMessage = `Generate a ${numQuestions}-question MCQ quiz for this content:\n\n${content}`;
    const response = await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse AI quiz response:', response);
      throw new Error('Failed to generate a valid quiz. Please try again.');
    }
  }

  async generateSubjectQuiz(subjectTitle, units, numQuestions = 10) {
    const combinedContent = units.map(u => `${u.title}: ${u.aiSummary || ''}`).join('\n\n');
    const systemPrompt = `You are an expert engineering professor. Generate a comprehensive ${numQuestions}-question MCQ quiz covering all units of the subject "${subjectTitle}".
Return the result ONLY as a valid JSON array of objects with fields: question, options (array of 4), correctAnswer (index 0-3), and explanation.`;

    const userMessage = `Generate a ${numQuestions}-question quiz for ${subjectTitle} covering these units:\n\n${combinedContent}`;
    const response = await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (e) {
      throw new Error('Failed to generate subject quiz.');
    }
  }

  async improveNotes(notes) {
    const systemPrompt = `Improve study notes by adding missing points, formulas, derivations, and exam tips.`;

    const userMessage = `Improve these notes:\n\n${notes}`;
    return await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
  }

  async explainAnswer(question, correctAnswer) {
    const systemPrompt = `You are an expert engineering professor. Explain why the given answer is correct.
    Keep the explanation clear, concise, and exam-focused. Include any relevant formulas or concepts.`;

    const userMessage = `Question: ${question}\n\nCorrect Answer: ${correctAnswer}`;
    return await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
  }
}

export const aiService = new AIService();
