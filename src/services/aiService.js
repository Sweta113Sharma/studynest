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
      return `### ⚡ 5-Minute Cramming Guide: Finite Automata & TOC

- **Deterministic Finite Automata (DFA)**:
  - 5-tuple: $M = (Q, \Sigma, \delta, q_0, F)$.
  - Deterministic: Exactly ONE transition for every state and symbol.

📐 **State Machine Transition Diagram**:
\`\`\`
[Start] ---> ( q0: Initial ) --'a'--> ( q1 ) --'b'--> (( q2: Final ))
                |                        ^                 |
                '----------'b'-----------'--------'a'------'
\`\`\`

> 🧠 Mnemonic: "F-I-V-E (DFA 5-Tuple)": **F**inal states ($F$), **I**nitial state ($q_0$), **V**ocabulary ($\Sigma$), **E**xact transition ($\delta$), and set of states ($Q$).

- **Pumping Lemma Test for Non-Regularity**:
  - Split any long string $w \in L$ into $w = xyz$ where $|xy| \le p$ and $|y| > 0$.
  - Pump $y^i$ ($i \ge 0$). If $xy^i z \notin L$, then $L$ is NOT regular!

> 🧠 Mnemonic: "P-U-M-P": **P**umping length ($p$), **U**npack string ($xyz$), **M**iddle non-empty ($|y|>0$), **P**ump exponent ($xy^iz \in L$).`;
    }

    if (userMessage.includes('graph algorithms') || userMessage.includes('dsa-ii')) {
      return `### ⚡ 5-Minute Cramming Guide: Graph Algorithms

- **BFS vs DFS Traversal**:
  - **BFS (Breadth-First Search)**: Level-order traversal using a **Queue** (Shortest path in unweighted graphs).
  - **DFS (Depth-First Search)**: Deep branch exploration using a **Stack/Recursion** (Cycle detection).

📐 **BFS Queue Flowchart**:
\`\`\`
[Root (1)] ---> [Queue: 2, 3] ---> Visit (2) ---> [Queue: 3, 4, 5] ---> Visit (3)...
\`\`\`

> 🧠 Mnemonic: "B-Q & D-S (BFS Queue, DFS Stack)": **B**FS uses a **Q**ueue; **D**FS uses a **S**tack!`;
    }

    if (userMessage.includes('er modeling') || userMessage.includes('dbms')) {
      return `### ⚡ 5-Minute Cramming Guide: DBMS Essentials

- **ACID Properties**:
  - **Atomicity**: All operations execute or none do.
  - **Consistency**: Preserves database invariant state before and after transaction.
  - **Isolation**: Concurrent transactions execute as if serial.
  - **Durability**: Committed data is stored permanently.

📐 **ER Relationship Schema**:
\`\`\`
[ STUDENT ] <=====( 1 : N - Enrolls )=====> [ COURSE ]
   ( PK: Student_ID )                          ( PK: Course_Code )
\`\`\`

> 🧠 Mnemonic: "A-C-I-D": **A**tomicity (All or None), **C**onsistency (Valid state), **I**solation (No interference), **D**urability (Permanent).`;
    }

    if (userMessage.includes('introduction to os') || userMessage.includes('operating systems')) {
      return `### ⚡ 5-Minute Cramming Guide: OS Fundamentals

- **4 Deadlock Necessary Conditions**:
  - Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.

📐 **CPU Scheduling Gantt Chart (Round Robin q=2)**:
\`\`\`
|  P1 (0 - 2ms)  |  P2 (2 - 4ms)  |  P3 (4 - 6ms)  |  P1 (6 - 8ms)  |
0                2                4                6                8
\`\`\`

> 🧠 Mnemonic: "M-H-N-C (Deadlock Conditions)": **M**utual Exclusion, **H**old & Wait, **N**o Preemption, **C**ircular Wait.`;
    }

    if (userMessage.includes('matrices') || userMessage.includes('matrix')) {
      return `### ⚡ 5-Minute Cramming Guide: Engineering Matrices

- **Cayley-Hamilton Theorem**:
  - Every square matrix satisfies its own characteristic equation $p(A) = 0$.

📐 **Matrix Diagonalization Transform**:
\`\`\`
A  =  P  *  D  *  P^(-1)
[ a11  a12 ]   [ x1  x2 ]   [ λ1   0 ]   [ x1  x2 ]^-1
[ a21  a22 ] = [ y1  y2 ] * [  0  λ2 ] * [ y1  y2 ]
\`\`\`

> 🧠 Mnemonic: "S-S-O (Same, Sign, One)": **S**ymmetric transpose is **Same** ($A^T=A$), **S**kew transpose switches **Sign** ($A^T=-A$), **O**rthogonal product yields identity **One** ($A A^T = I$).`;
    }

    return `### ⚡ 5-Minute High-Yield Cramming Guide: ${userMessage.split('\n')[0].replace(/generate revision notes for:\s*/i, '').replace(/unit \d+:\s*/i, '').trim() || 'Engineering Unit'}

- **Core Principles**: Primary definitions, physical models, and fundamental laws.
- **Key Equations**: Review essential formulas, variable definitions, and boundary constraints.

📐 **Visual Model Schematic**:
\`\`\`
[Input Variables] ---> [Physical / Mathematical System] ---> [Output Solution]
\`\`\`

> 🧠 Mnemonic: "C-F-D (Concept, Formula, Diagram)": State the **C**oncept definition, write the **F**ormula with units, and sketch a labeled **D**iagram for full exam marks!`;
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
    const systemPrompt = `You are an expert engineering professor creating the ultimate last-minute cramming study guide for students.
Create highly engaging, creative, and memorable revision notes.

MUST INCLUDE THE FOLLOWING SECTIONS:
1. ⚡ **5-Minute High-Yield Cramming Summary**: Direct, punchy exam points.
2. 📐 **Visual Model Schematic / ASCII Diagram**: MUST include at least one ASCII diagram or flowchart inside a triple-backtick (\\\`\\\`\\\`) code block (e.g. State Machine Diagram for Automata, Flowchart for Algorithms, Block Diagram for Hardware/DB, or Formula Matrix).
3. 🧠 **Memory Mnemonics & Acronyms**: MUST include at least 2 clever memory tricks or acronyms formatted starting with '> 🧠 Mnemonic: ...' (e.g. '> 🧠 Mnemonic: "F-I-V-E" ...').
4. ✍️ **Must-Know Exam Formulas & Step-by-Step Problem Checklist**.
5. 🎯 **Top Exam Question & Model Solution**.

Format nicely with Markdown headers (###), bold key terms, and bullet points for instant speed reading.`;

    const userMessage = `Generate last-minute cramming revision notes with ASCII diagrams and mnemonics for: ${unitTitle}\n\nUnit Content:\n${content}${onlineWiki}`;
    try {
      return await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
    } catch (e) {
      return `### ⚡ 5-Minute High-Yield Revision: ${unitTitle}
- **Core Principle**: Master foundational definitions, state equations, and physical models.
- **Exam High-Yield**: Focus on step-by-step numerical problem solving and clear labeled block diagrams.

📐 **Visual Model Schematic**:
\`\`\`
[Input Data] ---> [Processing / State Transformations] ---> [Final Output State]
\`\`\`

> 🧠 Mnemonic: "C-F-D (Concept, Formula, Diagram)": Always write the **C**oncept definition, state the **F**ormula with units, and draw a neat **D**iagram for maximum exam marks!`;
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

