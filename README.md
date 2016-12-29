# Critical Webpack Plugin

This is a webpack wrapper around [Addy Osmani's critical library](https://github.com/addyosmani/critical), which helps
to inline minimum necessary CSS in HTML documents to prevent stylesheet loading from blocking the [Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/).

## Install

```
$ npm install webpack-plugin-critical
```

## Usage

The following example shows how the Critical Webpack Plugin can be used to modify
the project's `index.html` file to inline only the (minified) CSS needed for the index page,
and asynchronously load the remaining CSS.

**webpack.config.js**

```js
const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin;
...
plugins: [
  new CriticalPlugin({
    src: 'index.html',
    inline: true,
    minify: true,
    dest: 'index.html'
  })
]
...
```

The only required option is `dest` and either `src` or `html`, since without dest, the output would
be lost. When using Critical directly (instead of using this plugin), `dest` isn't required because the
callback can accept the HTML or CSS output as a parameter.

Other than `dest`, all options are the same as Critical, so please see the
[Critical options](https://github.com/addyosmani/critical#options).

To see a fully working example, check out the [integration spec](./integration).

## Why?

When the browser sees this in a page:

```html
<link rel="stylesheet" href="mystyle.css">
```

The browser stops, loads the stylesheet and its dependencies, and cannot continue
rendering the page until the stylesheet is loaded and parsed.
So the user sees an empty screen while they wait for every stylesheet and script to
load.
The critical library solves this problem by figuring out what CSS is actually needed
for a given page, inlining the CSS into a `<style>` tag, and asynchronously loading the remaining CSS.

```html
<style>
.home-heading { font-size: 20pt; }
</style>
<link rel="preload" href="mystyle.css" onload="this.rel='stylesheet'">
```

By loading the stylesheet using `preload` instead of `stylesheet`, the browser
can begin downloading the stylesheet in the background, which comes in handy
in single page applications where additional views may be loaded that depend
on rules from the full stylesheet.

## TypeScript Support

This plugin is written in TypeScript and includes TypeScript typings,
which should automatically work if using TypeScript 2.x+.

