import { marked } from 'marked';
const result = marked.parse('# Hello');
console.log(typeof result, result);
