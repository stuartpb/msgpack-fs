#!/usr/bin/env node
var obtree = require('obtree');
var msgpack = require('msgpack');
var argv = require('minimist')(process.argv.slice(2),{
  boolean: ['n','p','b'],
  string: ['o']
});
var path = require('path');

function splitPathComponents(p) {
  return path.normalize(p).split(path.sep);
}

function layerWrap(obj, keys) {
  var layer;
  for (var i = keys.length-1; i >= 0; i--) {
    layer = {};
    layer[keys[i]] = obj;
    obj = layer;
  }
  return obj;
}

function trimValues(obj) {
  if (Buffer.isBuffer(obj)
    || typeof obj == "string" || obj instanceof String) {
    return obj.toString().trim();
  } else if (typeof obj == "object") {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = trimValues(obj[key]);
      }
    }
    return obj;
  } else return obj;
}

var paths = argv._;

var outstream = argv.o && argv.o != '-' ?
  require('fs').openFileSync(argv.o,'w')
  : process.stdout;

if (!argv.o && process.stdout.isTTY) {
  console.error("stdout appears to be a TTY:");
  console.error("since you probably don't want to spew binary data all over");
  console.error("your console, we'll refrain from performing the pack.");
  console.error("Use -o=FILE to specify an output file.");
} else {
  if (paths.length == 0) {
    console.error('msgpack-fs error: No paths specified');
  } else {
    outPackTree(0);
  }
}

function outPackTree(i) {
  var pathname = paths[i];
  if (pathname) obtree(pathname, {}, function(err, tree) {
    if (err) throw err;
    if (argv.n) trimValues(tree);
    if (argv.p || argv.k || argv.parents) {
      var layers = splitPathComponents(pathname);
      if(argv.k || typeof(argv.parents) == 'number')
        layers = layers.slice(argv.k ? -1 : -argv.parents);
      tree = layerWrap(tree, layers);
    }
    outstream.write(msgpack.pack(tree));
    return outPackTree(i + 1);
  });
}
