import { resolve } from 'path';
const critical = require('critical');
import { cleantmp } from 'webpack-util-cleantmp';

export interface CriticalPluginOptions {
  base?: string;
  inline?: boolean;
  minify?: boolean;
  extract?: boolean;
  timeout?: number
}

export class CriticalPlugin {
  constructor(public options: CriticalPluginOptions = {}) {
    const opts = {...this.options};
    this.options = {...{
      base: '',
      inline: true,
      minify: true,
      extract: true,
      timeout: 30000
    }, ...options};
  }


  emit(compilation, callback) {
    const options = this.options;
    const subscription = cleantmp({
      prefix: 'criticalcss',
      globToDisk: '**/*.+(css|html)',
      globFromDisk: '**/*.+(css|html)',
      assets: compilation.assets
    })
    .subscribe((tmp) => {
      const opts = {...options, ...{
        base: resolve(tmp, options.base)
      }};

      critical.generate(opts, (err, output) => {
        // TODO: Make recursive and start at root of tmp
        subscription.unsubscribe();
        callback(err);
      });
    })
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      this.emit(compilation, callback);
    });
  }
}
