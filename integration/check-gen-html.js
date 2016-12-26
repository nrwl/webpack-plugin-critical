const fs = require('fs');
const parse5 = require('parse5');

const doc = fs.readFileSync('./dist/index.html', 'utf-8');
const parsed = parse5.parse(doc, {treeAdapter: parse5.treeAdapters.htmlparser2});
const head = parsed.firstChild.firstChild;
const [style] = head.children.filter(n => n.name === 'style');
const [link] = head.children.filter(n => n.name === 'link');
const jasmine = require('jasmine');

if (style.firstChild.data !== `
      .styleme{color:red}
    `) {
      throw new Error('Style is not correct:', style.firstChild.data);
} else {
  console.log('<style> looks good!');
}
if(link.attribs['rel'] !== 'preload') {
  throw new Error('Link does not have preload');
} else {
  console.log('<link> looks good!');
}
