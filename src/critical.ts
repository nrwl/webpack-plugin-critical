import { resolve } from 'path';
const critical = require('critical');
import { cleantmp } from 'webpack-util-cleantmp';

export interface CriticalPluginOptions {
  base?: string;
  inline?: boolean;
  minify?: boolean;
  extract?: boolean;
  timeout?: number;
  src?: string;
  html?: string;
  dest?: string;
}

export class CriticalPlugin {
  options: CriticalPluginOptions;
  constructor(options: CriticalPluginOptions = {}) {
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
        subscription.unsubscribe();
        callback(err);
      });
    })
  }

  apply(compiler) {
    compiler.plugin("emit", this.emit);
  }
}
