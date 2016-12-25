import { CriticalPlugin } from './critical';
const parse5 = require('parse5');

const htmlDoc = `
<html>
  <head>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="styleme"></div>
  </body>
</html>
`;

const css = `
.styleme {
  color: #f00;
}
.ignoreme {
  color: #000;
}
`;



describe('CriticalPlugin', () => {
  var mockCompilation;
  beforeEach(() => {
    mockCompilation = {
      assets: {
        'index.html': {
          source: () => htmlDoc,
          size: () => 131
        },
        'style.css': {
          source: () => css,
          size: () => 58
        }
      }
    };
  });

  it('should set the provided options', () => {
    const options = Object.freeze({
      base: 'src',
      inline: false,
      minify: false,
      extract: false,
      timeout: 20000
    });
    let plugin = new CriticalPlugin(options);
    expect(plugin.options).toEqual(options);
  });


  it('should set default options', () => {
    const plugin = new CriticalPlugin();
    expect(plugin.options).toEqual({
      base: '',
      inline: true,
      minify: true,
      extract: true,
      timeout: 30000
    });
  });


  describe('apply', () => {
    it('should register for emit lifecycle', () => {
      let plugin = new CriticalPlugin();
      let compiler = jasmine.createSpyObj('compiler', ['plugin']);
      plugin.apply(compiler);
      expect(compiler.plugin).toHaveBeenCalledWith('emit', plugin.emit);
    });
  });

  describe('emit', () => {
    fit('should inline CSS in the document', (done) => {
      const plugin = new CriticalPlugin({
        src: 'index.html',
        dest: 'index.html'
      });
      plugin.emit(mockCompilation, () => {
        const doc = mockCompilation.assets['index.html'].source();
        expect(doc).not.toEqual(htmlDoc);
        const parsed = parse5.parse(doc, {treeAdapter: parse5.treeAdapters.htmlparser2});
        const head = parsed.firstChild.firstChild;
        const [style] = head.children.filter(n => n.name === 'style');
        const [link] = head.children.filter(n => n.name === 'link');
        expect(style.firstChild.data).toBe(`
      .styleme{color:red}
    `);
        expect(link.attribs['rel']).toBe('preload');

        done();
      });
    }, 10000);
  });
});
