export async function parsePdf(buffer: Buffer): Promise<string> {
  const content = buffer.toString("latin1");
  const textParts: string[] = [];

  // Find all compressed/uncompressed stream content
  // Look for text between stream markers
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let streamMatch;

  while ((streamMatch = streamRegex.exec(content)) !== null) {
    const streamContent = streamMatch[1];
    
    // Extract strings from BT...ET blocks
    const btEtRegex = /BT([\s\S]*?)ET/g;
    let btMatch;
    
    while ((btMatch = btEtRegex.exec(streamContent)) !== null) {
      const block = btMatch[1];
      
      // Match (text) Tj
      const tjRegex = /\(([^)]*)\)\s*Tj/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(block)) !== null) {
        const text = decodePdfString(tjMatch[1]);
        if (text.trim()) textParts.push(text);
      }
      
      // Match [(text) -200 (text)] TJ
      const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
      let tjArrayMatch;
      while ((tjArrayMatch = tjArrayRegex.exec(block)) !== null) {
        const arrayContent = tjArrayMatch[1];
        const strRegex = /\(([^)]*)\)/g;
        let strMatch;
        while ((strMatch = strRegex.exec(arrayContent)) !== null) {
          const text = decodePdfString(strMatch[1]);
          if (text.trim()) textParts.push(text);
        }
      }
    }
  }

  // If nothing found, the PDF uses compressed streams
  // Fall back to extracting any readable text sequences
  if (textParts.length < 10) {
    const readableRegex = /[A-Za-z][A-Za-z\s,.\-:;'"\(\)]{15,}/g;
    let readableMatch;
    const seen = new Set<string>();
    
    while ((readableMatch = readableRegex.exec(content)) !== null) {
      const str = readableMatch[0].trim();
      if (
        !seen.has(str) &&
        str.split(" ").length > 2 &&        // at least 3 words
        !/endobj|endstream|xref|trailer|startxref/i.test(str) &&
        !/^[A-Z\s]+$/.test(str)             // not all caps (PDF operators)
      ) {
        seen.add(str);
        textParts.push(str);
      }
    }
  }

  return textParts
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodePdfString(str: string): string {
  return str
    .replace(/\\n/g, " ")
    .replace(/\\r/g, " ")
    .replace(/\\t/g, " ")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\")
    .replace(/\\(\d{3})/g, (_, oct) =>
      String.fromCharCode(parseInt(oct, 8))
    );
}