# HSGameCenter Widgets

[CHANGELOG](https://github.com/playon/ds-hsgc-api-samples/blob/master/widgets/History.md)

## Requirements

1. **nodejs**
2. **npm**
3. **grunt** (`npm install -g grunt-cli`)

For development in Visual Studio 2012+

1. Visual Studio 2012+
2. [Node.js Tools for Visual Studio](https://nodejstools.codeplex.com/wikipage?title=Projects)

## Usage

### Running locally

1. Download the repository, and go to the `widgets` directory
2. Ensure npm is up to date with `npm update -g npm`
3. Run `npm install` to install the project dependencies
4. Create a new file in the main `widgets` directory called `.grunt-aws`. The file should contains a JSON object with the properties `key` and `secret`. For local testing, it can have fake data, and does *not* need access to the S3. For example, for local testing this will work: `{ "key": "your_key", "secret": "your_secret" }`
5. To build: run `grunt`.  This will create a minified javascript file at `build/hsgc-widgets.min.js`, as well as styled and un-styled, example HTML pages
6. To test: Go to [http://localhost:3001/](http://localhost:3001/) and select an appropriate HTML file to test
7. To automatically watch for file changes and rebuild, run `grunt watch`.

### Deploying
1. Create a new file called `.grunt-aws`. The file should contains a JSON object with the properties `key` and `secret` that have access to the cdn.hsgamecenter.com S3 bucket. Example: `{ "key": "your_key", "secret": "your_secret" }`
2. Run `grunt deploy`.  This will copy all files from the build directory to the cdn.hsgamecenter.com S3 bucket with the path `/js/ds-widgets/{version from package.json}/`

### Development

#### Setup for Visual Studio 2012+:

1. Install [Node.js Tools for Visual Studio](https://nodejstools.codeplex.com/wikipage?title=Projects)
2. Open `hsgc-widgets.sln`
3. Note: Building/running from VS on Windows still doesn't work because of the ongoing Path Too Long problem node has when running on Windows. But you can still use VS as an editor. Or switch to [Sublime](http://www.sublimetext.com/).

#### Architecture

The high-level view of the system is that grunt compiles the code down into a handful of resource files. Then a simple HTML include of jQuery, the compiled JS output, and the compiled CSS output is added to a basic HTML body with a few `<div>`s with AngularJS attribute directives and an inline `<script>` block to initialize the widgets and you're done.

The bulk of the code you will probably need to modify for development is in less files for styling, the `src/js/directives` or `src/js/filters` for code, and `src/templates` for the HTML templates.

Other important files:

* For new sports, update `/src/js/services/hsgc-api.js` and `src/js/directives/datacast.js` to allow the new sport
* Info about configuration options are available at `src/js/services/hsgcConfig.js`

#### Debug logging

AngularJS provides the `$logProvider` for logging purposes. Inject `'$log'` into a directive/service/etc and use `$log.debug('message ' + obj.someValue)` which will then output to the standard `console.log`. 

Other levels can be used (info, error, warn) but are generally discouraged since they will be put in the console in production. Why won't DEBUG level? Because the HSGC widget `app.js` file configures DEBUG messages to not display.

To enable DEBUG messages to display, *temporarily* change this configuration to `$logProvider.debugEnabled(true);`. Only do this during development; *do not commit this change* so that production will continue to suppress these logs.