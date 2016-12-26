import { resolve } from 'path';
const critical = require('critical');
import { cleantmp } from 'webpack-util-cleantmp';

/**
 * Options to be passed directly to Critical plugin.
 * https://github.com/addyosmani/critical#options
 */
export interface CriticalPluginOptions {
  inline?: boolean;
  /**
   * Base directory in which the source and destination are to be written.
   */
  base?: string;
  /**
   * HTML source to be operated against.
   * This option takes precedence over the src option.
   */
  html?: string;
  /**
   * Location of the HTML source to be operated against.
   */
  src?: string;
  /**
   * Location of where to save the output of an operation
   * (will be relative to base if no absolute path is set).
   */
  dest: string;
  /**
   * Subfolder relative to base directory.
   * Only relevant without src (if raw html is provided) or if the destination is outside base.
   */
  destFolder?: string;
  /**
   * Width of the target viewport.
   */
  width?: number;
  /**
   * Height of the target viewport.
   */
  height?: number;
  /**
   * An array of objects containing height and width.
   * Takes precedence over width and height if set.
   */
  dimensions?: CriticalPluginDimension[];
  /**
   * Inline critical-path CSS using filamentgroup's loadCSS
   */
  minify?: boolean;
  /**
   * Remove the inlined styles from any stylesheets referenced in the HTML.
   * It generates new references based on extracted content so it's safe to use for multiple HTML files referencing the same stylesheet.
   * Use with caution.
   * Removing the critical CSS per page results in a unique async loaded CSS file for every page.
   * Meaning you can't rely on cache across multiple pages
   */
  extract?: boolean;
  /**
   * Inline images.
   */
  inlineImages?: boolean;
  /**
   * List of directories/urls where the inliner should start looking for assets.
   */
  assetPaths?: string[];
  /**
   * Sets a max file size (in bytes) for base64 inlined images
   */
  maxImageFileSize?: number;
  /**
   * Sets a maximum timeout for the operation.
   */
  timeout?: number;
  /**
   * Path to prepend CSS assets with.
   * You must make this path absolute if you are going to be using critical in multiple target files in disparate directory depths.
   * (eg. targeting both /index.html and /admin/index.html would require this path to start with / or it wouldn't work.)
   */
  pathPrefix?: string;
  /**
   * Force include CSS rules. See https://github.com/pocketjoso/penthouse#usage-1
   */
  include?: string[];
  /**
   * Ignore CSS rules. See https://github.com/bezoerb/filter-css for usage examples.
   */
  ignore?: string[];
  /**
   * Ignore options. See https://github.com/bezoerb/filter-css#options.
   */

}

export interface CriticalPluginDimension {
  height: number;
  width: number
}

export class CriticalPlugin {
  constructor(public options: CriticalPluginOptions) {
    if (!options.dest) {
      throw new Error('A `dest` option is required for the Critical webpack plugin');
    }
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
        base: resolve(tmp, options.base || ''),
        dest: resolve(tmp, options.dest)
      }};

      critical.generate(opts, (err, output) => {
        subscription.unsubscribe();
        callback(err);
      });
    })
  }

  apply(compiler) {
    compiler.plugin("emit", this.emit.bind(this));
  }
}
