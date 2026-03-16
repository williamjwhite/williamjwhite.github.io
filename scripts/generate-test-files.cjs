const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { Document, Packer, Paragraph, TextRun } = require("docx");

// ---------------------------------------------------------
// CONTENT
// ---------------------------------------------------------
const CONTENT = `
Client Document Portal — Test File
This document is auto‑generated for testing purposes only.

SERVICES & EXPERTISE
I design and automate secure, scalable DocuSign workflows and API integrations for enterprise organizations and high‑volume operational teams.

As a former Partner TCSM at DocuSign, I was responsible for reviewing and advising on new partner integrations including API design, workflow architecture, backup and exception handling, testing, go‑live readiness, user adoption, and ensuring each deployment delivered measurable ROI.

My background includes supporting large‑scale DocuSign implementations used by Fortune‑level brands and nationwide dealer networks across automotive, motorcycle, and heavy equipment industries, as well as national retail, banking, and insurance organizations. This experience comes from contributing to complex, distributed deployments involving hundreds of locations and thousands of end users.

While DocuSign is my primary specialty, I also develop workflows and integrations for Adobe Acrobat Sign, Dropbox Sign, PandaDoc, OneSpan, and other eSignature platforms.

INDUSTRIES SERVED

Enterprise & Regulated Industries
- Fortune 100/500 organizations
- Large enterprise and distributed operations
- Fintech platforms
- Banking & financial services
- Digital mortgage & eVaulting
- Capital markets, chattel, and securitization
- Compliance‑driven and regulated environments

Small & Mid‑Sized Businesses
- Real estate teams and brokerages
- Tax offices and accounting firms
- Medical practices and clinics
- Auto, powersports, and RV dealerships
- Retail, service, and multi‑location businesses
- SMEs and growing organizations

TEST FILE — NOT FOR PRODUCTION
Generated for testing purposes only — williamjwhite.me
`;

// ---------------------------------------------------------
// OUTPUT DIRECTORY: /public/test-files
// ---------------------------------------------------------
const outDir = path.join(process.cwd(), "public", "test-files");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------
// TXT
// ---------------------------------------------------------
fs.writeFileSync(path.join(outDir, "test-file.txt"), CONTENT);

// ---------------------------------------------------------
// Markdown
// ---------------------------------------------------------
fs.writeFileSync(
  path.join(outDir, "test-file.md"),
  `# Client Document Portal — Test File\n\n\`\`\`\n${CONTENT}\n\`\`\`\n`
);

// ---------------------------------------------------------
// HTML
// ---------------------------------------------------------
const HTML = `
<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; background: #FAFAFA; color: #23272F; padding: 40px; }
h1 { color: #57C4DC; }
.watermark { color: #E5E7EB; font-size: 0.9em; }
pre { background: #F3F4F6; padding: 20px; border-radius: 8px; }
.footer { margin-top: 40px; color: #6B7280; font-size: 0.85em; }
</style>
</head>
<body>
<h1>Client Document Portal — Test File</h1>
<p class="watermark">TEST FILE — NOT FOR PRODUCTION</p>
<pre>${CONTENT}</pre>
<div class="footer">Generated for testing purposes only — williamjwhite.me</div>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, "test-file.html"), HTML);

// ---------------------------------------------------------
// DOCX
// ---------------------------------------------------------
const doc = new Document({
  sections: [
    {
      children: CONTENT.split("\n").map(
        (line) =>
          new Paragraph({
            children: [new TextRun(line)],
          })
      ),
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(path.join(outDir, "test-file.docx"), buffer);
});

// ---------------------------------------------------------
// PDF
// ---------------------------------------------------------
const pdf = new PDFDocument();
pdf.pipe(fs.createWriteStream(path.join(outDir, "test-file.pdf")));
pdf.fontSize(10).text(CONTENT, { lineGap: 4 });
pdf.end();

// ---------------------------------------------------------
// PNG & JPG (simple placeholder)
// ---------------------------------------------------------
fs.writeFileSync(path.join(outDir, "test-file.png"), Buffer.from("TEST FILE — NOT FOR PRODUCTION"));
fs.writeFileSync(path.join(outDir, "test-file.jpg"), Buffer.from("TEST FILE — NOT FOR PRODUCTION"));

console.log("All test files generated in /public/test-files");
