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

1. Run `npm install`
2. Create a new file in the main `widgets` directory called `.grunt-aws`. The file should contains a JSON object with the properties `key` and `secret`. For local testing, it can have fake data, and does *not* need access to the S3. For example, for local testing this will work: `{ "key": "your_key", "secret": "your_secret" }`
3. To build: run `grunt`.  This will create a minified javascript file at `build/hsgc-widgets.min.js`, as well as styled and un-styled, example HTML pages
4. To test: Go to [http://localhost:3001/](http://localhost:3001/) and select an appropriate html file to test
4. To automatically watch for file changes and rebuild, run `grunt watch`.

### Deploying
1. Create a new file called `.grunt-aws`. The file should contains a JSON object with the properties `key` and `secret` that have access to the cdn.hsgamecenter.com S3 bucket. Example: `{ "key": "your_key", "secret": "your_secret" }`
2. Run `grunt deploy`.  This will copy all files from the build directory to the cdn.hsgamecenter.com S3 bucket with the path `/js/ds-widgets/{version from package.json}/`

### Development
For Visual Studio 2012+:

1. Install [Node.js Tools for Visual Studio](https://nodejstools.codeplex.com/wikipage?title=Projects)
2. Open `hsgc-widgets.sln`
3. Note: Building/running from VS on Windows still doesn't work because of the ongoing Path Too Long problem node has when running on Windows. But you can still use VS as an editor. Or switch to [Sublime](http://www.sublimetext.com/).