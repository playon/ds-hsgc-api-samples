# HSGameCenter Widgets

## Requirements

1. nodejs
2. npm
3. grunt (npm install -g grunt-cli)

## Usage

### Running locally

1. Run "npm install"
2. To build: run "grunt".  This will create a minified javascript file at build/hsgc-widgets.min.js, as well as styled and unstyled example html pages
3. To automatically watch for file changes and rebuild, run "grunt watch".

### Deploying
1. Create a new file called .grunt-aws.  The file should contains a json object with the properties "key" and "secret" that have access to the cdn.hsgamecenter.com S3 bucket.
2. Run "grunt deploy".  This will copy all files from the build directory to the cdn.hsgamecenter.com S3 bucket with the path /js/ds-widgets/{version from package.json}/
