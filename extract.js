const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractText() {
    try {
        const doc = await pdfjsLib.getDocument('Arvind-Resume.pdf').promise;
        let text = '';
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
        }
        console.log(text);
    } catch (e) {
        console.error(e);
    }
}
extractText();
