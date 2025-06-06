const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Read the built HTML file
const htmlPath = path.join(__dirname, '../out/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// Inline CSS files
$('link[rel="stylesheet"]').each((i, elem) => {
  const href = $(elem).attr('href');
  if (href && !href.startsWith('http')) {
    const cssPath = path.join(__dirname, '../out', href);
    try {
      const css = fs.readFileSync(cssPath, 'utf8');
      $(elem).replaceWith(`<style>${css}</style>`);
    } catch (err) {
      console.warn(`Could not inline CSS file: ${href}`);
    }
  }
});

// Inline JavaScript files
$('script[src]').each((i, elem) => {
  const src = $(elem).attr('src');
  if (src && !src.startsWith('http')) {
    const jsPath = path.join(__dirname, '../out', src);
    try {
      const js = fs.readFileSync(jsPath, 'utf8');
      $(elem).removeAttr('src').html(js);
    } catch (err) {
      console.warn(`Could not inline JavaScript file: ${src}`);
    }
  }
});

// Inline images (convert to base64)
$('img[src]').each((i, elem) => {
  const src = $(elem).attr('src');
  if (src && !src.startsWith('http') && !src.startsWith('data:')) {
    const imgPath = path.join(__dirname, '../out', src);
    try {
      const img = fs.readFileSync(imgPath);
      const ext = path.extname(src).substring(1);
      const base64 = img.toString('base64');
      $(elem).attr('src', `data:image/${ext};base64,${base64}`);
    } catch (err) {
      console.warn(`Could not inline image: ${src}`);
    }
  }
});

// Save the result
const outputPath = path.join(__dirname, '../out/standalone.html');
fs.writeFileSync(outputPath, $.html());
console.log('Created standalone HTML file at:', outputPath); 