
/**
 * 
 * @param {String} html 
 * @returns 
 */
export default function addHeadingId(html) {
  return html.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, content) => {
    let headingText = content.trim();
    let headingId = headingText.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    if (headingId.startsWith('-')) {
      headingId = headingId.slice(1);
    }
    return `<h${level} id="${headingId}">${content}</h${level}>`;
  });
}

export { addHeadingId };
