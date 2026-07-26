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
    const msg = userMessage.toLowerCase();

    if (msg.includes('array') || msg.includes('linked list') || msg.includes('singly') || msg.includes('doubly') || msg.includes('list')) {
      return `### 📚 In-Depth Master Revision Notes: Arrays & Linked Lists

#### 1. 📌 Fundamental Concepts & Architecture
- **Arrays (Static Sequential Storage)**:
  - Contiguous memory allocation storing homogeneous elements.
  - Constant $O(1)$ random access using array base pointer offset calculations.
  - **Memory Address Calculation**:
    - **1D Array**: $LOC(A[i]) = Base(A) + w \\times (i - LB)$ where $w$ = element size in bytes, $LB$ = lower bound (typically 0).
    - **2D Array (Row-Major Order)**: $LOC(A[i][j]) = Base(A) + w \\times [(i - L1) \\times N2 + (j - L2)]$
    - **2D Array (Column-Major Order)**: $LOC(A[i][j]) = Base(A) + w \\times [(j - L2) \\times N1 + (i - L1)]$
- **Linked Lists (Dynamic Pointer-Based Storage)**:
  - Non-contiguous memory allocation; nodes linked together via dynamic heap pointers.
  - **Singly Linked List**: Each node contains \`data\` and a \`next\` pointer.
  - **Doubly Linked List**: Each node contains \`prev\` pointer, \`data\`, and \`next\` pointer allowing bidirectional traversal.
  - **Circular Linked List**: The \`next\` pointer of the final tail node points directly back to \`HEAD\`.

#### 2. 📐 Visual Memory Schematics & Pointer Layouts

**Array Contiguous Memory Map (4 Bytes per Integer)**:
\`\`\`
Index:        [ 0 ]         [ 1 ]         [ 2 ]         [ 3 ]         [ 4 ]
Value:      |   10   |   |   20   |   |   30   |   |   40   |   |   50   |
Memory:       0x1000        0x1004        0x1008        0x100C        0x1010
\`\`\`

**Singly Linked List Node Connections**:
\`\`\`
[ HEAD: 0x2000 ]
      |
      v
 [ Data: 15 | Next: 0x3040 ] ---> [ Data: 25 | Next: 0x4080 ] ---> [ Data: 35 | Next: NULL ]
   Address: 0x2000                  Address: 0x3040                  Address: 0x4080
\`\`\`

**Doubly Linked List Bidirectional Node Structure**:
\`\`\`
[ HEAD: 0x100 ] <=========================================================> [ TAIL: 0x300 ]
     |                                                                           |
     v                                                                           v
[ Prev: NULL | Data: A | Next: 0x200 ] <---> [ Prev: 0x100 | Data: B | Next: 0x300 ] <---> [ Prev: 0x200 | Data: C | Next: NULL ]
  Address: 0x100                              Address: 0x200                              Address: 0x300
\`\`\`

#### 3. 📊 Complexity & Time/Space Performance Metrics

| Operation | Static Array | Singly Linked List | Doubly Linked List |
| :--- | :--- | :--- | :--- |
| **Random Access by Index** | $O(1)$ Constant | $O(n)$ Linear | $O(n)$ Linear |
| **Search Element** | $O(n)$ ($O(\\log n)$ if sorted) | $O(n)$ Linear | $O(n)$ Linear |
| **Insertion at Head** | $O(n)$ (Requires element shift) | $O(1)$ Constant | $O(1)$ Constant |
| **Insertion at Tail** | $O(1)$ (if capacity remains) | $O(n)$ ($O(1)$ with tail ref) | $O(1)$ Constant |
| **Deletion at Head** | $O(n)$ (Requires element shift) | $O(1)$ Constant | $O(1)$ Constant |
| **Memory Overhead** | 0 extra bytes | 1 pointer ($4/8$ bytes) per node | 2 pointers ($8/16$ bytes) per node |

#### 4. 💻 Complete C Pointer Algorithm: In-Place Linked List Reversal
\`\`\`c
struct Node* reverseLinkedList(struct Node* head) {
    struct Node *prev = NULL, *curr = head, *next = NULL;
    while (curr != NULL) {
        next = curr->next;  // 1. Store next pointer
        curr->next = prev;  // 2. Reverse current node link
        prev = curr;        // 3. Step prev forward
        curr = next;        // 4. Step curr forward
    }
    return prev; // Return new head of reversed list
}
\`\`\`

#### 5. 🧠 Memory Mnemonics & High-Yield Exam Acronyms
> 🧠 Mnemonic: "A-C-L-D (Arrays vs Lists)": **A**rrays are **C**ontiguous ($O(1)$ Access), **L**ists are **D**ynamic ($O(1)$ Insert/Delete).
> 🧠 Mnemonic: "P-C-N (Linked List Reversal Order)": **P**rev, **C**urr, **N**ext — Save **N**ext, flip **C**urr link to **P**rev, advance **P**rev & **C**urr!
> 🧠 Mnemonic: "R-M-O (Row Major Order)": **R**ow moves slowest, **M**ultiply row diff by total columns $N_2$, **O**ffset by $Base$.

#### 6. 🎯 University Exam Model Question & Step-by-Step Solution
**Question**: An array $A[1..10][1..15]$ is stored in Row-Major order starting at Base Address $2000$. If each element occupies $4$ bytes, calculate the location of $A[6][8]$.

**Solution**:
- **Given**: $Base = 2000$, $w = 4$, $L1 = 1$, $L2 = 1$, $N2 = 15$.
- **Target**: Row $i = 6$, Column $j = 8$.
- **Formula**: $LOC(A[i][j]) = Base + w \\times [(i - L1) \\times N2 + (j - L2)]$
- Step 1: Row difference $= (i - L1) = 6 - 1 = 5$ rows.
- Step 2: Multiply by columns per row $= 5 \\times 15 = 75$ elements.
- Step 3: Column difference $= (j - L2) = 8 - 1 = 7$ elements.
- Step 4: Total element offset $= 75 + 7 = 82$ elements.
- Step 5: Address $= 2000 + 4 \\times 82 = 2000 + 328 = \\mathbf{2328}$.`;
    }

    if (msg.includes('stack') || msg.includes('queue') || msg.includes('postfix') || msg.includes('infix')) {
      return `### 📚 In-Depth Master Revision Notes: Stacks & Queues

#### 1. 📌 Fundamental Concepts & Operations
- **Stack (LIFO - Last In First Out)**:
  - Push ($O(1)$), Pop ($O(1)$), Peek ($O(1)$).
  - Primary uses: Function call stack, recursion evaluation, backtracking, expression conversion (Infix to Postfix).
  - Overflow condition: \`top == MAX - 1\` (Array implementation).
  - Underflow condition: \`top == -1\`.
- **Queue (FIFO - First In First Out)**:
  - Enqueue ($O(1)$ at Rear), Dequeue ($O(1)$ at Front).
  - **Circular Queue**: Resolves memory wastage by wrapping pointers:
    - Enqueue position: \`rear = (rear + 1) % MAX\`
    - Overflow condition: \`(rear + 1) % MAX == front\`

#### 2. 📐 Visual Architecture & Stack Frame Schematic

**Stack Memory Push & Pop Operations**:
\`\`\`
  [ PUSH 30 ]           [ POP ]
+-------------+      +-------------+
| 30  <- TOP  |      |             |
| 20          | ---> | 20  <- TOP  |
| 10          |      | 10          |
+-------------+      +-------------+
\`\`\`

**Circular Queue Ring Buffer Diagram**:
\`\`\`
         [ Index 0: 10 ]
     /                     \\
[ Index 3: 40 ]           [ Index 1: 20 ]  <-- FRONT
     \\                     /
         [ Index 2: 30 ]  <-- REAR
\`\`\`

#### 3. 📊 Operator Precedence & Associativity Table

| Operator | Description | Precedence | Associativity |
| :--- | :--- | :--- | :--- |
| **\`^\`** | Exponentiation | 3 (Highest) | Right to Left |
| **\`*\`**, **\`/\`** | Multiplication / Division | 2 | Left to Right |
| **\`+\`**, **\`-\`** | Addition / Subtraction | 1 (Lowest) | Left to Right |

#### 4. 🧠 Memory Mnemonics & Exam Tricks
> 🧠 Mnemonic: "LIFO vs FIFO": **S**tack = **L**IFO (Pancake stack), **Q**ueue = **F**IFO (Movie theater line).
> 🧠 Mnemonic: "C-Q-F (Circular Queue Full)": \`(rear + 1) % MAX == front\`!

#### 5. 🎯 Exam Model Question & Solution
**Question**: Convert the infix expression $A + B * (C - D)$ to Postfix notation.

**Solution**:
1. Scan $A$: Output $\rightarrow A$
2. Scan $+$: Push $+$ to Stack.
3. Scan $B$: Output $\rightarrow A \, B$
4. Scan $*$: Push $*$ to Stack (Higher precedence than $+$).
5. Scan $($: Push $($ to Stack.
6. Scan $C$: Output $\rightarrow A \, B \, C$
7. Scan $-$: Push $-$ to Stack.
8. Scan $D$: Output $\rightarrow A \, B \, C \, D$
9. Scan $)$: Pop operators until $( \rightarrow$ Pop $- \rightarrow$ Output $\rightarrow A \, B \, C \, D \, -$
10. End of string: Pop remaining operators ($*, +$) $\rightarrow$ Output: $\mathbf{A \, B \, C \, D \, - \, * \, +}$.`;
    }

    if (msg.includes('automata') || msg.includes('theory of computation') || msg.includes('dfa') || msg.includes('nfa')) {
      return `### 📚 In-Depth Master Revision Notes: Finite Automata & TOC

#### 1. 📌 Fundamental Definitions & State Models
- **Deterministic Finite Automata (DFA)**:
  - Formally defined as a 5-tuple $M = (Q, \Sigma, \delta, q_0, F)$:
    - $Q$: Finite set of states.
    - $\Sigma$: Input alphabet.
    - $\delta$: Transition function $\delta: Q \times \Sigma \rightarrow Q$.
    - $q_0 \in Q$: Initial start state.
    - $F \subseteq Q$: Set of final/accepting states.
- **NFA vs DFA**: NFA allows $\epsilon$-transitions and multiple next states ($\delta: Q \times (\Sigma \cup \{\epsilon\}) \rightarrow 2^Q$). Every NFA can be converted to an equivalent DFA using Subset Construction.

#### 2. 📐 State Machine Transition Schematics
\`\`\`
[Start] ---> ( q0: Initial State ) --'a'--> ( q1 ) --'b'--> (( q2: Final Accept State ))
                 |                           ^                     |
                 '------------'b'------------'----------'a'--------'
\`\`\`

#### 3. 🧠 Memory Mnemonics & Exam Tricks
> 🧠 Mnemonic: "F-I-V-E (DFA 5-Tuple)": **F**inal states ($F$), **I**nitial state ($q_0$), **V**ocabulary ($\Sigma$), **E**xact transition ($\delta$), and set of states ($Q$).
> 🧠 Mnemonic: "P-U-M-P (Pumping Lemma)": **P**umping length ($p$), **U**npack string ($xyz$), **M**iddle non-empty ($|y|>0$), **P**ump exponent ($xy^iz \in L$).`;
    }

    if (msg.includes('computer network') || msg.includes('network model') || msg.includes('tcp/ip') || msg.includes('osi model') || (msg.includes('network') && !msg.includes('neural network') && !msg.includes('bayesian network') && !msg.includes('d.c circuit'))) {
      return `### 📚 In-Depth Master Revision Notes: Computer Networks

#### 1. 📌 Fundamental Concepts & OSI vs TCP/IP Reference Models
- **OSI 7-Layer Reference Model (Open Systems Interconnection)**:
  - **7. Application Layer**: User interfaces and network services (HTTP, HTTPS, FTP, DNS, SMTP, SSH).
  - **6. Presentation Layer**: Data representation, encryption/decryption, SSL/TLS, data compression.
  - **5. Session Layer**: Dialog control, session checkpointing, synchronization (NetBIOS, PPTP).
  - **4. Transport Layer**: End-to-end communication, segmentation, flow control, error recovery (TCP, UDP).
  - **3. Network Layer**: Logical addressing, packet routing, forwarding, ICMP (IPv4, IPv6, OSPF, BGP, ARP).
  - **2. Data Link Layer**: Physical addressing (MAC), framing, error detection (CRC), MAC control (Ethernet 802.3, Wi-Fi 802.11).
  - **1. Physical Layer**: Bit transmission over physical medium, modulation, line coding (Copper, Fiber Optics, Wireless).
- **TCP/IP 4-Layer Architecture**:
  - Application Layer (OSI 5-7), Transport Layer (OSI 4), Internet Layer (OSI 3), Network Access / Link Layer (OSI 1-2).

#### 2. 📐 Visual Packet Header & OSI Model Schematic

**OSI 7-Layer Stack & PDU Encapsulation Flow**:
\`\`\`
[ Layer 7: Application  ] ---> Data (HTTP / DNS)
[ Layer 6: Presentation ] ---> Formatted / Encrypted Data
[ Layer 5: Session      ] ---> Synchronized Session Data
[ Layer 4: Transport    ] ---> [ TCP Header | Data ] (Segment / Datagram)
[ Layer 3: Network      ] ---> [ IP Header | TCP Header | Data ] (Packet)
[ Layer 2: Data Link    ] ---> [ MAC Header | IP Header | TCP Header | Data | CRC Trailer ] (Frame)
[ Layer 1: Physical     ] ---> 101101001011010... (Bits transmitted over copper/fiber)
\`\`\`

**IPv4 Header Structure (32-Bit Word Alignment)**:
\`\`\`
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version|  IHL  |Type of Service|          Total Length         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Identification        |Flags|      Fragment Offset    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Time to Live |    Protocol   |    Header Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       Source IP Address                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Destination IP Address                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
\`\`\`

#### 3. 📊 Key Protocol Comparison: TCP vs UDP

| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection Type** | Connection-oriented (3-Way Handshake) | Connectionless (No handshake) |
| **Reliability** | Guaranteed delivery (ACK & retransmission) | Best-effort (No ACKs, packets may drop) |
| **Header Size** | 20-60 Bytes | 8 Bytes |
| **Flow & Congestion Control** | Sliding Window, AIMD, Slow Start | None |
| **Speed** | Moderate (Overhead for ACKs) | Ultra-fast (Low latency) |
| **Use Cases** | Web (HTTP/S), Email (SMTP), File Transfer (FTP) | Video Streaming, Online Gaming, DNS, VoIP |

#### 4. 🧠 Memory Mnemonics & Exam Tricks
> 🧠 Mnemonic: "All People Seem To Need Data Processing" (OSI Top-Down): **A**pplication, **P**resentation, **S**ession, **T**ransport, **N**etwork, **D**ata Link, **P**hysical.
> 🧠 Mnemonic: "Please Do Not Touch Steve's Pet Alligator" (OSI Bottom-Up): **P**hysical, **D**ata Link, **N**etwork, **T**ransport, **S**ession, **P**resentation, **A**pplication.
> 🧠 Mnemonic: "S-A-K (TCP 3-Way Handshake)": **S**YN (Client $\\rightarrow$ Server), **S**YN-**A**CK (Server $\\rightarrow$ Client), **A**CK (Client $\\rightarrow$ Server).

#### 5. 🎯 University Exam Numerical: Subnetting & IP Address Calculation
**Question**: An IPv4 address is given as \`192.168.10.35/27\`. Calculate Network Mask, Network Address, Broadcast Address, and Total Usable Hosts.

**Solution**:
- **CIDR Prefix**: \`/27\` means 27 network bits and $32 - 27 = 5$ host bits.
- **Subnet Mask**: $255.255.255.224$.
- **Block Size**: $256 - 224 = 32$ addresses per subnet.
- **Network Address**: $35$ lies in subnet $32..63 \\implies \\mathbf{192.168.10.32}$.
- **Broadcast Address**: $\\mathbf{192.168.10.63}$.
- **Usable Hosts**: $2^5 - 2 = \\mathbf{30}$ hosts (\`192.168.10.33\` to \`192.168.10.62\`).`;
    }

    if (msg.includes('graph') || msg.includes('tree') || msg.includes('bst') || msg.includes('dsa-ii') || msg.includes('dijkstra') || msg.includes('kruskal') || msg.includes('bfs') || msg.includes('dfs')) {
      return `### 📚 In-Depth Master Revision Notes: Tree & Graph Algorithms

#### 1. 📌 Core Graph & Tree Definitions
- **Binary Search Tree (BST)**: For any node $N$, $LeftChild(N) < N < RightChild(N)$.
  - Inorder traversal of a BST always yields elements in **sorted ascending order**.
- **Graph Traversals**:
  - **BFS (Breadth-First Search)**: Level-by-level exploration using a **Queue**. Time Complexity: $O(V + E)$.
  - **DFS (Depth-First Search)**: Deep path exploration using a **Stack / Recursion**. Time Complexity: $O(V + E)$.
- **Shortest Path & MST**:
  - **Dijkstra's Algorithm**: Single-source shortest path for non-negative edge weights using Min-Heap ($O((V + E) \log V)$).
  - **Kruskal's Algorithm**: Greedy Minimum Spanning Tree (MST) using Union-Find ($O(E \log E)$).

#### 2. 📐 Visual Binary Search Tree & Traversal Schematic
\`\`\`
            ( 50 )
           /      \\
        ( 30 )    ( 70 )
       /     \\    /    \\
    ( 20 ) ( 40 )( 60 ) ( 80 )

Traversals:
- Inorder   (L-N-R): 20 -> 30 -> 40 -> 50 -> 60 -> 70 -> 80  (Sorted)
- Preorder  (N-L-R): 50 -> 30 -> 20 -> 40 -> 70 -> 60 -> 80
- Postorder (L-R-N): 20 -> 40 -> 30 -> 60 -> 80 -> 70 -> 50
\`\`\`

#### 3. 📊 Graph & Tree Algorithm Complexity Table

| Algorithm | Data Structure | Time Complexity | Space Complexity | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **BFS** | Queue | $O(V + E)$ | $O(V)$ | Shortest path in unweighted graph |
| **DFS** | Stack / Recursion | $O(V + E)$ | $O(V)$ | Topological sort & cycle detection |
| **Dijkstra** | Priority Queue (Min-Heap) | $O((V + E) \log V)$ | $O(V)$ | Single-source shortest path |
| **Kruskal** | Disjoint Set (Union-Find) | $O(E \log E)$ | $O(V)$ | Minimum Spanning Tree (MST) |

#### 4. 🧠 Memory Mnemonics & Exam Tricks
> 🧠 Mnemonic: "B-Q & D-S": **B**FS uses a **Q**ueue; **D**FS uses a **S**tack!
> 🧠 Mnemonic: "I-S-O (Inorder Sorted Order)": **I**norder traversal of BST gives **S**orted **O**utput!`;
    }

    if (msg.includes('er modeling') || msg.includes('dbms') || msg.includes('sql') || msg.includes('database')) {
      return `### 📚 In-Depth Master Revision Notes: Database Management Systems (DBMS)

#### 1. 📌 Fundamental Concepts & Normalization Rules
- **ACID Properties of Transactions**:
  - **Atomicity**: All operations succeed or all roll back (All-or-Nothing).
  - **Consistency**: Database state moves from one valid invariant state to another.
  - **Isolation**: Concurrent transactions execute independently without mutual interference.
  - **Durability**: Committed updates persist permanently even after hardware crashes.
- **Relational Normalization Forms**:
  - **1NF**: Atomic values (No multi-valued attributes).
  - **2NF**: 1NF + No partial dependencies (Non-key attributes depend on entire Candidate Key).
  - **3NF**: 2NF + No transitive dependencies ($X \rightarrow Y$, $Y \rightarrow Z \implies X \rightarrow Z$).
  - **BCNF**: 3NF + For every functional dependency $X \rightarrow Y$, $X$ must be a Super Key.

#### 2. 📐 ER Diagram & Relation Mapping Schematic
\`\`\`
[ STUDENT ] <=====( 1 : N - Enrolls )=====> [ COURSE ]
   ( PK: Student_ID )                          ( PK: Course_Code )
\`\`\`

#### 3. 🧠 Memory Mnemonics & Exam Tricks
> 🧠 Mnemonic: "A-C-I-D": **A**tomicity (All or None), **C**onsistency (Valid state), **I**solation (No interference), **D**urability (Permanent).
> 🧠 Mnemonic: "K-P-T (Normalization Rules)": "The key (1NF), the whole key (2NF), and nothing but the key (3NF), so help me Codd!"`;
    }

    // Dynamic High-Yield Detailed Notes Fallback for ANY topic
    const topicTitle = userMessage.split('\n')[0].replace(/generate revision notes for:\s*/i, '').replace(/unit \d+:\s*/i, '').replace(/generate last-minute cramming revision notes with ascii diagrams and mnemonics for:\s*/i, '').trim() || 'Engineering Unit';

    return `### 📚 In-Depth Master Revision Notes: ${topicTitle}

#### 1. 📌 Fundamental Principles & Theoretical Architecture
- **Core Definition**: ${topicTitle} forms a foundational pillar of modern engineering systems, defining structural behavior, operational limits, and analytical models.
- **Primary Objectives**:
  - Systematic analysis and design of engineering components.
  - Optimization of throughput, structural stability, and computational efficiency.
  - Mathematical formulation of system boundary conditions and response metrics.

#### 2. 📐 Visual Architecture & Process Flow Schematic
\`\`\`
+-----------------------+      +---------------------------------+      +------------------------+
| Input Parameters      | ---> | System Processing Engine        | ---> | Labeled Solution       |
| (Variables & Bounds)  |      | (Governing Equations & Logic)   |      | (Output & Analysis)    |
+-----------------------+      +---------------------------------+      +------------------------+
              ^                                  |
              |====== Feedback & Optimization ===|
\`\`\`

#### 3. 📊 Analytical Performance & System Metrics Table

| Metric / Parameter | Operational Range | Governing Constraint | Impact on Efficiency |
| :--- | :--- | :--- | :--- |
| **System Capacity ($C$)** | Nominal to Maximum | Boundary Limits | Prevents saturation & overload |
| **Response Time ($T$)** | Minimal ($O(1)$ to $O(n)$) | Latency threshold | Maximizes real-time throughput |
| **Stability Factor ($\sigma$)** | Range $[0, 1]$ | Invariant constraints | Guarantees system equilibrium |

#### 4. ✍️ Fundamental Equations & Mathematical Formulation
- **Primary System Equation**:
  $$Y = f(X) = \sum_{k=1}^{n} w_k \cdot x_k + \beta$$
- **Efficiency Metric ($\eta$)**:
  $$\eta = \left( \frac{\text{Output Work / Output State}}{\text{Input Energy / Total Input}} \right) \times 100\%$$

#### 5. 🧠 High-Yield Memory Mnemonics & Exam Acronyms
> 🧠 Mnemonic: "C-F-D (Concept, Formula, Diagram)": State the **C**oncept definition, write the **F**ormula with units, and sketch a labeled **D**iagram for full exam marks!
> 🧠 Mnemonic: "S-P-E-E-D": **S**pecify given inputs, **P**ick governing formula, **E**valuate step-by-step, **E**xpress correct units, **D**raw supporting schematic!

#### 6. 🎯 University Exam Model Question & Step-by-Step Solution
**Question**: Explain the fundamental principles of **${topicTitle}**. Derive the primary governing equation and list key design constraints for university examinations.

**Solution**:
1. **Definition**: State the formal definition clearly in the first paragraph.
2. **Derivation / Formulation**: Substitute boundary conditions into the general equation $Y = f(X)$.
3. **Diagram**: Draw a neat, labeled block diagram or flowchart.
4. **Conclusion & Units**: Verify dimensional homogeneity and state the final result with appropriate engineering units.`;
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
    return this.generateDetailedNotes(content, unitTitle);
  }

  async generateDetailedNotes(content, unitTitle) {
    const onlineWiki = await this.fetchOnlineKnowledge(unitTitle);
    const systemPrompt = `You are a distinguished Engineering Professor and Master Educator creating an exhaustive, highly detailed study guide for university students.

YOUR TASK: Write an IN-DEPTH, TEXTBOOK-QUALITY MASTER STUDY GUIDE for "${unitTitle}".

MUST INCLUDE ALL OF THE FOLLOWING 6 SECTIONS IN FULL DETAIL:
1. 📚 **Comprehensive Core Concepts & Theoretical Definitions**:
   - Provide deep theoretical explanations for all major concepts.
   - Explain real-world applications, memory models, and architectural principles.
2. 📐 **Visual Model Schematics & ASCII Architecture Diagrams**:
   - Provide at least 2 detailed ASCII flowcharts, state diagrams, data structure pointer layouts, memory maps, or circuit schematics in triple-backtick (\`\`\`) blocks.
3. 📊 **Complexity & Performance Metrics Table**:
   - Provide a markdown table comparing Time Complexity (Best, Average, Worst), Space Complexity ($O(1)$, $O(n)$, etc.), edge cases, and trade-offs.
4. 💻 **Step-by-Step Pseudocode & Code Snippets**:
   - Include complete algorithm implementations or pseudocode in C / C++ / Python.
5. ✍️ **Mathematical Equations & Governing Formulas**:
   - State all fundamental formulas, parameter definitions, variable units, and boundary constraints.
6. 🧠 **Memory Mnemonics & Exam Tricks**:
   - Include at least 3 high-yield acronyms formatted as '> 🧠 Mnemonic: ...' for instant exam recall.
7. 🎯 **Top University Exam Question & Model Solution**:
   - Provide a full exam numerical or conceptual question with step-by-step model solution.

Format with clear Markdown headers (###), bold key terms, tables, code blocks, and bullet points for maximum readability.`;

    const userMessage = `Generate comprehensive textbook-grade revision notes with ASCII diagrams, code implementations, complexity tables, and memory tricks for: ${unitTitle}\n\nUnit Syllabus & Content:\n${content}${onlineWiki}`;
    try {
      return await this.callAI([{ role: 'user', content: userMessage }], systemPrompt);
    } catch (e) {
      return this.getOfflineMockResponse(userMessage, systemPrompt);
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

