# Digital Scout Widgets

[![Build Status](http://build.digitalscout.com/buildStatus/icon?job=GameCenterWidgetsBuild)](http://build.digitalscout.com/job/GameCenterWidgetsBuild)

## [CHANGELOG](https://github.com/playon/ds-hsgc-api-samples/blob/master/widgets/History.md)

## Examples

See the `examples` directory for what kind of code you would need to use to embed these widgets in an `IFRAME` anywhere on the web.

The examples are available for display at `https://cdn.digitalscout.com/js/hsgc-widgets/VERSION/EXAMPLE.html` where `VERSION` is the current version as specified in `package.json` and `EXAMPLE.html` is the one of the example HTML files in the `examples/` directory in this repository. For example, [`https://cdn.digitalscout.com/js/hsgc-widgets/2.1.0/minibox.html`](https://cdn.digitalscout.com/js/hsgc-widgets/2.1.0/minibox.html)

Most of the examples link to a specific game for demonstration. Most of the common examples, like `football.html`, `basketball.html`, and `volleyball.html` do not. Instead, you need to pass a `gameKey` like you need to when you reference the specific game you want to show.

Here are some examples you can use in this case:

* [`basketball.html?gameKey=9105703`](https://cdn.digitalscout.com/js/hsgc-widgets/2.1.0/basketball.html?gameKey=9105703)
* [`football.html?gameKey=8284106`](https://cdn.digitalscout.com/js/hsgc-widgets/2.1.0/football.html?gameKey=8284106)
* [`volleyball.html?gameKey=8267306`](https://cdn.digitalscout.com/js/hsgc-widgets/2.1.0/volleyball.html?gameKey=8267306)

## License

This code is licensed under the MIT license (see the README at the top level of this repository for more info) but access to the API data requires a separate license. So use and modify this code as allowed in the MIT license, but don't load any data from **api.digitalscout.com** without a written agreement with Digital Scout, LLC.

## Development Requirements

1. **nodejs** v14.15+
1. **npm**
1. **grunt** (`npm install -g grunt-cli`)

## Usage

### Running locally

1. Download this repository, and navigate to the `widgets` directory
1. Ensure `nodejs` is installed (preferably by `nvm`)
1. Ensure npm is up to date with `npm update -g npm`
1. Install `grunt` globally: `npm install grunt yarn -g`
1. Run `yarn` to install the project dependencies
   1. Note: Windows Powershell can't run some special syntax paperjs `0.12.11` uses, so you need to use git bash or similar, by running this at the command line `C:\Program Files\git\bin\bash.exe` then running `yarn` from there. (See [paperjs issue #1833](https://github.com/paperjs/paper.js/issues/1833) for more on the issue.)
1. Create a new file in the main `widgets` directory called `.grunt-aws`. The file should contains a JSON object with the properties `key` and `secret`. For local testing, it can have fake data, and does *not* need access to the S3. For example, for local testing this will work: `{ "key": "your_key", "secret": "your_secret" }`
1. To build: run `grunt` which will create a minified JavaScript file at `build/hsgc-widgets.min.js`, as well as styled and un-styled, example HTML pages
1. To test, go to [`https://localhost:3001/`](https://localhost:3001/) and select an appropriate HTML file to test—you will have to accept the self-signed certificate in your browser
1. To automatically watch for file changes and rebuild, run `grunt watch` (or use the default `grunt` task which calls the same `watch` task)

### Deploying

1. If it does not yet exist, create a new file called `.grunt-aws`. The file should contains a JSON object with the properties `key` and `secret` that have access to the `cdn.hsgamecenter.com` S3 bucket. Example: `{ "key": "your_key", "secret": "your_secret" }`
1. If any images were added or modified, run `grunt optimize` to losslessly compress all files in the `/src/img` directory
1. Run `grunt deploy`.  This will copy all files from the build directory to the cdn.hsgamecenter.com S3 bucket with the path `/js/ds-widgets/{version from package.json}/`. The assets in this bucket should then be accessed via the CloudFront cache of that bucket via `https://cdn.digitalscout.com/js/ds-widgets/{version from package.json}/...`.

#### Architecture

The high-level view of the system is that grunt compiles the code down into a handful of resource files. Then a simple HTML include of jQuery, the compiled JS output, and the compiled CSS output is added to a basic HTML body with a few `<div>`s with AngularJS attribute directives and an inline `<script>` block to initialize the widgets and you're done.

The bulk of the code you will probably need to modify for development is in less files for styling, the `src/js/directives` or `src/js/filters` for code, and `src/templates` for the HTML templates.

#### Other important files

* For new sports, update `src/js/directives/datacast.js`, `src/js/services/hsgc-api.js`, `src/templates/gameSummary.html`, and `src/templates/fullBoxScore.html` to allow and implement the new sport, in addition to any new directives and templates required for that sport
* Info about configuration options are available at `src/js/services/hsgcConfig.js`

#### Debug logging

AngularJS provides the `$logProvider` for logging purposes. Inject `'$log'` into a directive/service/etc and use `$log.debug('message ' + obj.someValue)` which will then output to the standard `console.log`.

Other levels can be used (info, error, warn) but are generally discouraged since they will be put in the console in production. Why won't DEBUG level? Because the HSGC widget `app.js` file configures DEBUG messages to not display.

To enable DEBUG messages to display, *temporarily* change this configuration to `$logProvider.debugEnabled(true);`. Only do this during development; *do not commit this change* so that production will continue to suppress these logs.
