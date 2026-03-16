```markdown
---
title: WXWUI Portal Upload Test — PDF Ready (Markdown)
watermark-header: "PORTAL TEST FILE — PDF (Markdown)"
watermark-footer: "Generated for upload pipeline validation — williamjwhite.me"
---

# WXWUI Portal Upload Test  
**PDF‑Ready Markdown Version**

This file is structured specifically for PDF generation using Markdown‑to‑PDF tools such as:

- Pandoc  
- md-to-pdf  
- wkhtmltopdf (via HTML conversion)  
- WXWUI’s internal PDF pipeline  

It avoids raw HTML and uses only PDF‑safe Markdown.

---

# 1. Basic Text Rendering

This paragraph ensures the PDF conversion pipeline:

- preserves headings  
- maintains paragraph spacing  
- handles bold and italic text  
- respects YAML front‑matter  

---

# 2. Code Blocks (PDF‑Safe)

### JavaScript Example

```js
function pdfTest() {
  return "PDF upload successful";
}
```

### JSON Example

```json
{
  "status": "ok",
  "format": "pdf-ready-markdown",
  "message": "Portal test file loaded"
}
```

### Shell Example

```bash
echo "Testing PDF pipeline"
```

---

# 3. Inline Code

Inline code should appear monospaced in the PDF:  
`const x = 42;`

---

# 4. Tables (PDF‑Compatible)

| Field | Value | Notes |
|-------|--------|--------|
| A | 1 | Basic numeric test |
| B | 2 | Ensures table rendering |
| C | 3 | Confirms border handling |

---

# 5. Lists

### Unordered List

- Item one  
- Item two  
- Item three  

### Ordered List

1. First  
2. Second  
3. Third  

---

# 6. Horizontal Rules

Above and below this line should appear as PDF horizontal rules:

---

---

# 7. Blockquotes

> This is a PDF‑safe blockquote.  
> It should convert cleanly into a styled paragraph.

---

# 8. Mixed Content

This section mixes:

- Headings  
- Lists  
- Code  
- Tables  
- Blockquotes  

All of which must survive PDF conversion without corruption.

---

# 9. Final Validation

If this file:

- uploads successfully  
- converts to PDF without errors  
- preserves formatting  
- returns cleanly through the portal  

…then PDF handling is confirmed working.

**End of Document B — PDF Ready (Markdown)**
```
