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
    const userMessage = messages[messages.length - 1].content.toLowerCase();

    // 1. Attempt OpenRouter API if user has configured API key
    if (this.apiKey) {
      const fullMessages = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;

      const modelsToTry = [
        this.model,
        'openai/gpt-oss-120b:free',
        'nvidia/nemotron-3-super-120b-a12b:free',
        'minimax/minimax-m2.5:free',
        'nvidia/nemotron-nano-9b-v2:free',
        'nvidia/nemotron-3-nano-30b-a3b:free'
      ];

      for (const modelId of modelsToTry) {
        try {
          console.log(`Attempting OpenRouter AI call with model: ${modelId}`);
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

          if (response.ok) {
            const data = await response.json();
            if (data.choices?.[0]?.message?.content) {
              return data.choices[0].message.content;
            }
          }
        } catch (e) {
          console.warn(`OpenRouter model ${modelId} failed, trying next online provider...`);
        }
      }
    }

    // 2. Attempt Public Online AI API (No key required for live online AI response)
    try {
      console.log('Fetching live response from Public Online AI API...');
      const fullMessages = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;

      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: fullMessages,
          model: 'openai'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      }
    } catch (e) {
      console.warn('Public OpenAI endpoint failed, trying secondary online endpoint...', e);
    }

    try {
      const fullPrompt = `${systemPrompt ? systemPrompt + '\n\n' : ''}${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}`;
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: fullPrompt }]
        })
      });
      if (response.ok) {
        const text = await response.text();
        if (text && text.trim()) return text;
      }
    } catch (e) {
      console.warn('Online AI endpoint unavailable, using offline dataset fallback.');
    }

    // 3. Offline fallback if device is completely offline
    return this.getOfflineMockResponse(userMessage, systemPrompt);
  }

  getOfflineMockResponse(userMessage, systemPrompt = '') {
    if (userMessage.includes('automata') || userMessage.includes('theory of computation') || userMessage.includes('dfa') || userMessage.includes('nfa')) {
      if (systemPrompt.includes('summary')) {
        return `### Comprehensive AI Overview: Theory of Computation (Finite Automata)
Theory of Computation investigates formal models of computation and formal language theory.

**Key Units & Concepts:**
1. **Deterministic Finite Automata (DFA)**: 5-tuple M = (Q, Σ, δ, q0, F) where δ: Q × Σ → Q is deterministic.
2. **Nondeterministic Finite Automata (NFA)**: Transition function δ: Q × Σ → 2^Q allows multiple state transitions or ε-moves.
3. **Equivalence of DFA & NFA**: Every NFA can be converted to an equivalent DFA using Subset Construction.
4. **Regular Languages & Regular Expressions**: Languages recognized by Finite Automata.
5. **Pumping Lemma for Regular Languages**: Tool used to prove that a language is NOT regular.

**Exam Strategy:**
Master DFA minimization and NFA to DFA conversion problems. Pumping Lemma proofs are standard 10-mark questions.`;
      }
      return `### Revision Notes: Finite Automata & Formal Languages
- **DFA (Deterministic Finite Automata)**:
  - 5-tuple: $(Q, \Sigma, \delta, q_0, F)$.
  - Exactly one transition for every state and input symbol combination.
- **NFA vs DFA**:
  - NFA allows zero, one, or multiple next states for an input, including $\epsilon$-transitions.
  - Subset construction converts NFA ($n$ states) to equivalent DFA ($\le 2^n$ states).
- **DFA Minimization**:
  - Removes unreachable states and merges equivalent state pairs.
- **Regular Expressions & Kleene's Theorem**:
  - $R = R_1 + R_2$ (Union), $R_1 R_2$ (Concatenation), $R^*$ (Kleene Closure).
- **Pumping Lemma**:
  - If $L$ is regular, there exists pumping length $p$ such that any string $w \in L$ with $|w| \ge p$ can be written $w = xyz$ satisfying $|xy| \le p$, $|y| > 0$, and $xy^i z \in L$ for all $i \ge 0$.`;
    }

    if (userMessage.includes('graph algorithms') || userMessage.includes('dsa-ii')) {
      if (systemPrompt.includes('summary')) {
        return `### Comprehensive AI Overview: Data Structures & Algorithms II
This subject focuses on advanced algorithmic techniques, particularly graph-based solutions and complex data structures.

**Key Units & Concepts:**
1. **Graph Fundamentals**: Understanding V, E, and degree properties.
2. **Traversals**: BFS for shortest path in unweighted graphs; DFS for connectivity and topological sorting.
3. **Spanning Trees**: Prim's (vertex-based) and Kruskal's (edge-based) algorithms for MST.
4. **Shortest Paths**: Dijkstra's algorithm (Greedy approach) and Bellman-Ford (Dynamic Programming).

**Essential Formulas:**
- Handshaking Lemma: Σ deg(v) = 2|E|.
- Dijkstra Complexity: O(E + V log V).`;
      }
      return `### Revision Notes: Graph Algorithms
- **Graph Representation**:
  - Adjacency Matrix: Best for dense graphs, O(1) edge lookup.
  - Adjacency List: Best for sparse graphs, O(V+E) space.
- **BFS (Breadth-First Search)**: Uses Queue, level-order traversal.
- **DFS (Depth-First Search)**: Uses Stack/Recursion, cycle detection.`;
    }

    if (userMessage.includes('er modeling') || userMessage.includes('dbms')) {
      return `### Revision Notes: DBMS Essentials
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability.
- **Normalization**: 1NF (Atomic), 2NF (No partial dependency), 3NF (No transitive dependency), BCNF.
- **Joins**: Inner Join, Left Join, Right Join, Full Outer Join.`;
    }

    if (userMessage.includes('introduction to os') || userMessage.includes('operating systems')) {
      return `### Revision Notes: OS Fundamentals
- **Process States**: New, Ready, Running, Waiting, Terminated.
- **CPU Scheduling**: FCFS, SJF, Round Robin, Multilevel Queue.
- **Deadlock Conditions**: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.`;
    }

    if (userMessage.includes('matrices') || userMessage.includes('matrix')) {
      return `### Revision Notes: Matrices
- **Symmetric Matrix**: $A^T = A$.
- **Skew-Symmetric Matrix**: $A^T = -A$.
- **Cayley-Hamilton Theorem**: Every square matrix satisfies its own characteristic equation $p(A) = 0$.
- **Eigenvalues**: Roots of $\det(A - \lambda I) = 0$. Sum equals Trace, product equals Determinant.`;
    }

    return `### Revision Notes: ${userMessage.split('\n')[0].replace(/generate revision notes for:\s*/i, '').replace(/unit \d+:\s*/i, '').trim() || 'Engineering Unit'}
- **Core Principles**: Primary definitions, physical models, and fundamental laws.
- **Key Equations**: Review essential formulas, variable definitions, and boundary constraints.
- **Exam Tips**: Focus on step-by-step mathematical derivations and neat block schematics.`;
  }

  async fetchOnlineKnowledge(topic) {
    if (!topic) return '';
    try {
      const cleanTopic = topic.replace(/Unit \d+:\s*/gi, '').trim();
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanTopic)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.extract) {
          return `\n\n[Live Online Knowledge Base - Wikipedia]:\n${data.extract}`;
        }
      }
    } catch (e) {
      console.log('Online Wiki search fetch skipped');
    }
    return '';
  }

  async generateNotes(content, unitTitle) {
    const onlineWiki = await this.fetchOnlineKnowledge(unitTitle);
    const systemPrompt = `You are an expert engineering professor. Generate highly detailed yet precise, exam-focused revision notes optimized for last-minute cramming.
Format: Use bullet points with clear, bold headings.
Requirements:
1. Include all key formulas, mathematical equations, and variable explanations clearly.
2. Incorporate creative mnemonics, acronyms, or memory tricks to help students memorize formulas and complex sequences/concepts instantly.
3. Keep explanations highly concise and conceptual for fast speed-reading.`;

    const userMessage = `Generate revision notes for: ${unitTitle}\n\nContent:\n${content}${onlineWiki}`;
    try {
      return await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
    } catch (e) {
      return `### Revision Notes: ${unitTitle}
- **Core Principles**: High-yield concepts and definitions for exam preparation.
- **Key Formulas**: Review standard equations and unit representations.
- **Exam Tip**: Focus on step-by-step numerical problem solving and clear block diagrams.`;
    }
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
- explanation: A brief explanation of why that option is correct.`;

    const userMessage = `Generate a ${numQuestions}-question MCQ quiz for this content:\n\n${content}`;
    try {
      const response = await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (e) {
      return [
        { question: "What is the primary objective of this unit?", options: ["System analysis & design", "Data compression", "Signal modulation", "Routing protocol"], correctAnswer: 0, explanation: "Engineering unit study focuses on core system analysis & design." },
        { question: "Which mathematical property is most fundamental?", options: ["Linearity", "Commutativity", "Orthogonality", "Convergence"], correctAnswer: 0, explanation: "Linearity simplifies analysis in engineering systems." },
        { question: "What is the standard step before solving numericals?", options: ["Identify given variables & units", "Guess the final value", "Skip formulas", "Use default constants"], correctAnswer: 0, explanation: "Listing given variables ensures correct formula application." },
        { question: "In exam evaluation, what gains maximum presentation marks?", options: ["Labeled diagrams & step-by-step formulas", "Paragraphs of plain text", "Unstructured notes", "Missing units"], correctAnswer: 0, explanation: "Engineers use diagrams and clear steps for maximum clarity." },
        { question: "Why is active recall recommended for revision?", options: ["Improves memory retention", "Saves paper", "Decreases speed", "Replaces textbooks"], correctAnswer: 0, explanation: "Active recall builds strong long-term memory pathways." }
      ];
    }
  }

  async generateSubjectQuiz(subjectTitle, units, numQuestions = 10) {
    const combinedContent = units.map(u => `${u.title}: ${u.aiSummary || ''}`).join('\n\n');
    const systemPrompt = `You are an expert engineering professor. Generate a comprehensive ${numQuestions}-question MCQ quiz covering all units of the subject "${subjectTitle}".
Return the result ONLY as a valid JSON array of objects with fields: question, options (array of 4), correctAnswer (index 0-3), and explanation.`;

    const userMessage = `Generate a ${numQuestions}-question quiz for ${subjectTitle} covering these units:\n\n${combinedContent}`;
    try {
      const response = await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
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
    try {
      return await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
    } catch (e) {
      return `**Explanation:** The option "${correctAnswer}" is correct because it satisfies the fundamental principles and equations governing this question.`;
    }
  }

  async generateFlashcards(content, count = 6) {
    const systemPrompt = `You are an expert engineering tutor. Generate ${count} high-yield revision flashcards for active recall study based on the content provided.
Return ONLY a valid JSON array of objects. Each object must have:
- front: A concise question, term, formula name, or concept prompt.
- back: The clear answer, definition, equation with variables, or explanation.`;

    const userMessage = `Generate ${count} flashcards for this content:\n\n${content}`;
    try {
      const response = await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (e) {
      return [
        { front: "Core Concept", back: "Fundamental principles and definitions governing this topic." },
        { front: "Key Equation", back: "Ensure all variables and unit conversions are specified before calculation." },
        { front: "Exam Application", back: "Practice step-by-step problem derivations and neat block diagrams." }
      ];
    }
  }

  async chat(messages, contextSummary = '') {
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const onlineWiki = await this.fetchOnlineKnowledge(lastUserMessage || contextSummary);

    const systemPrompt = `You are StudyNest AI — an encouraging, highly knowledgeable engineering study assistant.
Help the student understand complex technical concepts, clarify doubts, explain math/code step-by-step, and share exam strategies.
Keep responses clear, well-structured with Markdown headings and bullet points, and directly answer their question.
Context info: ${contextSummary}${onlineWiki}`;

    try {
      return await this.callAI(messages, systemPrompt);
    } catch (e) {
      return `### 💡 StudyNest AI Assistant
      
Here is an overview for **${contextSummary || 'your topic'}**:

- **Active Recall**: Test your memory with interactive flashcards and practice quizzes.
- **Key Formulas & Proofs**: State all initial assumptions, variable definitions, and boundary conditions clearly in exam answers.
- **Diagrams**: Draw clear labeled schematics for maximum presentation points.

*(You can also set your custom OpenRouter API key in Settings for dedicated custom models!)*`;
    }
  }
}

export const aiService = new AIService();

