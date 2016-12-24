import { CriticalPlugin } from './critical';

const mockCompilation = {
  assets: {
    'foo.json': {
      source: () => '{"foo": "bar"}',
      size: () => 14
    }
  }
};

const mockCompiler = {
  plugin: (lifecycle) => {

  }
}

describe('CriticalPlugin', () => {
  describe('apply', () => {
    it('should register for emit lifecycle', () => {
      let plugin = new CriticalPlugin();
      let compiler = jasmine.createSpyObj('compiler', ['plugin']);
      plugin.apply(compiler);

      let args = (<jasmine.Spy>compiler.plugin).calls.first().args;
      expect(args[0]).toBe('emit');
      expect(typeof args[1]).toBe('function');
    });
  });
});
