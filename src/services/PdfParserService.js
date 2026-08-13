import * as pdfjsLib from 'pdfjs-dist';

// Configure CDN worker since we are running in the browser and want to avoid complex bundler configurations for workers.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.9.155/build/pdf.worker.min.mjs`;

class PdfParserService {
  async parseRawText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const typedarray = new Uint8Array(event.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ') + '\n';
          }
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  async parseSyllabusPdf(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const typedarray = new Uint8Array(event.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          
          let fullText = '';
          const numPages = pdf.numPages;
          
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          const parsedData = this.extractSyllabusDetails(fullText);
          resolve(parsedData);
        } catch (error) {
          console.error("Error parsing PDF file:", error);
          reject(error);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  extractSyllabusDetails(text) {
    // 1. Try to find Course Code
    let courseCode = '';
    const codeMatch = text.match(/(?:Course\s+Code|Subject\s+Code|Code)\s*:?\s*([A-Z0-9-]{5,10})/i);
    if (codeMatch) {
      courseCode = codeMatch[1].trim();
    } else {
      // Fallback: look for patterns like AAS0103 or AME0252
      const patternMatch = text.match(/\b([A-Z]{3}\d{4})\b/);
      if (patternMatch) {
        courseCode = patternMatch[1].trim();
      }
    }

    // 2. Try to find Course Title
    let courseTitle = '';
    const titleMatch = text.match(/(?:Course\s+Title|Subject\s+Name|Title)\s*:?\s*([A-Za-z0-9\s&]{4,100})/i);
    if (titleMatch) {
      courseTitle = titleMatch[1].trim().replace(/\s+/g, ' ');
    } else {
      // Fallback: Try to find text before Course Code or first line containing B.Tech
      const firstLineMatch = text.match(/B\.\s*TECH\s+(?:FIRST|SECOND|THIRD|FOURTH)?\s*YEAR/i);
      if (firstLineMatch) {
        // Look around for title
        const nextLines = text.substring(text.indexOf(firstLineMatch[0])).split('\n').slice(1, 4);
        const titleCandidate = nextLines.find(line => line.trim().length > 10 && !line.includes('Code') && !line.includes('Credit'));
        if (titleCandidate) courseTitle = titleCandidate.trim();
      }
    }

    if (!courseTitle) courseTitle = 'Imported Subject';
    if (!courseCode) courseCode = 'IMP-' + Math.floor(Math.random() * 1000);

    // Clean up title if it contains tabs or excessive punctuation
    courseTitle = courseTitle.replace(/[\t\r]/g, ' ').replace(/\s+/g, ' ').trim();

    // 3. Extract Units
    const units = [];
    // We search for phrases like "Unit I", "Unit 1", "Unit - I", "Unit II", etc.
    const unitHeaders = [
      /Unit\s*[-–]?\s*I\b/i,
      /Unit\s*[-–]?\s*II\b/i,
      /Unit\s*[-–]?\s*III\b/i,
      /Unit\s*[-–]?\s*IV\b/i,
      /Unit\s*[-–]?\s*V\b/i,
      /Unit\s*[-–]?\s*1\b/i,
      /Unit\s*[-–]?\s*2\b/i,
      /Unit\s*[-–]?\s*3\b/i,
      /Unit\s*[-–]?\s*4\b/i,
      /Unit\s*[-–]?\s*5\b/i
    ];

    // Find indices of unit headers
    const matches = [];
    unitHeaders.forEach((regex, idx) => {
      const match = text.match(regex);
      if (match && match.index !== undefined) {
        matches.push({
          num: (idx % 5) + 1, // support Roman and Numeric
          index: match.index,
          headerText: match[0]
        });
      }
    });

    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);

    // Filter duplicates (e.g. if matches found both "Unit I" and "Unit 1" for same unit)
    const uniqueMatches = [];
    matches.forEach(m => {
      if (!uniqueMatches.some(um => um.num === m.num)) {
        uniqueMatches.push(m);
      }
    });
    uniqueMatches.sort((a, b) => a.index - b.index);

    if (uniqueMatches.length > 0) {
      for (let i = 0; i < uniqueMatches.length; i++) {
        const current = uniqueMatches[i];
        const next = uniqueMatches[i + 1];
        const start = current.index;
        const end = next ? next.index : text.length;
        
        let unitText = text.substring(start, end).trim();
        let unitContent = unitText.replace(current.headerText, '').trim();
        // Clean up leading colons, dashes
        unitContent = unitContent.replace(/^[:\s-–\.,\f]+/, '');

        // Truncate reference materials at end of last unit
        if (!next) {
          const booksIdx = unitContent.search(/(?:Text\s*books|Reference\s*books|Suggested\s*readings)/i);
          if (booksIdx !== -1) {
            unitContent = unitContent.substring(0, booksIdx).trim();
          }
        }

        unitContent = unitContent.replace(/\s+/g, ' ').trim();

        // Limit content size and try to derive a short title (up to 40 chars)
        let unitTitle = `Unit ${current.num}`;
        const firstSentence = unitContent.split(/[\.:;]/)[0];
        if (firstSentence && firstSentence.length > 5 && firstSentence.length < 80) {
          unitTitle = `Unit ${current.num}: ${firstSentence.trim()}`;
        }

        units.push({
          title: unitTitle,
          aiSummary: unitContent || `Syllabus topics for ${unitTitle}.`,
          ppts: [],
          notes: [],
          youtube: []
        });
      }
    } else {
      // Fallback: If no distinct unit headers, split by chapters or create 5 default units from syllabus body
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const contentSample = lines.slice(0, 15).join('\n');
      for (let i = 1; i <= 5; i++) {
        units.push({
          title: `Unit ${i}`,
          aiSummary: `Syllabus details for Unit ${i}. Text context: \n` + contentSample.substring(0, 300),
          ppts: [],
          notes: [],
          youtube: []
        });
      }
    }

    return {
      id: `${courseCode.toLowerCase()}-${Date.now()}`,
      key: courseCode.toLowerCase().replace(/[^a-z0-9]/g, '') || 'custom',
      title: courseTitle,
      code: courseCode,
      units: units
    };
  }
}

export const pdfParserService = new PdfParserService();
