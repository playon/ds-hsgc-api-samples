//var grunt = require('grunt');
//grunt.tasks();

var port = process.env.LR_PORT || process.env.PORT || 35729;

var path    = require('path');
var express = require('express');
var tinylr  = require('tiny-lr');
var body    = require('body-parser');

var app = express();

app
  .use(body())
  .use(tinylr.middleware({ app: app }))
  .use(express.static(path.resolve('./build')))
  .listen(port, function() {
    console.log('listening on %d', port);
  });
