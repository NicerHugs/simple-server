var http = require('http');
var fs = require('fs');

const encodingMap = {
  '.ico': null,
  '.css': {encoding: 'utf8'},
  '.js' : {encoding: 'utf8'}
};

const contentTypeMap = {
  '.ico' : 'image/icon',
  '.css' : 'text/css',
  '.js' : 'text/javascript'
}

var cachedPaths = [];

function serveFile(data, err, fileContents) {
  if (err) {
    data.response.writeHead(404);
    data.response.end();
  } else {
    data.response.writeHead(200, {'Content-Type': contentTypeMap[data.ext]})
    data.response.end(fileContents);
  }
}

function handleRequest(request, response) {
  var path = request.url;
  var ext = path.match(/(\..+)/) ? path.match(/(\..+)/)[0] : undefined;
  var encoding = encodingMap[ext] === undefined ? {encoding: 'utf8'} : encodingMap[ext]
  var data = {response: response, ext: ext};
  if (ext) {
    cachedPaths.forEach(function(p) {
      if (path.indexOf(p) > -1) {
        path = path.substr(p.length);
      }
    });
    fs.readFile('public' + path, encoding, serveFile.bind(null, data))
  } else {
    cachedPaths.push(path.substr(0, path.lastIndexOf('/')));
    fs.readFile('public/index.html', {encoding: 'utf8'}, serveFile.bind(null, data));
  }
};

http.createServer(handleRequest).listen(3000, function() {
  console.log('server listening on port 3000');
});
