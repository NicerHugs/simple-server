var http = require('http');
var fs = require('fs');

function handleRequest(request, response) {
  var path = request.url;
  if (path === '/favicon.ico') {
    fs.readFile('public/favicon.ico', function(err, data) {
      response.setHeader('Content-Type', 'image/icon')
      response.end(data);
    });
  } else if (path.match('/styles/')) {
    fs.readFile('public'+path, {encoding: 'utf8'}, function(err, data) {
      if (err) {
        response.writeHead(404);
      }
      response.setHeader('Content-Type', 'text/css')
      response.end(data);
    });
  } else {
    path = path === '/' ? '/index.html' : path.match('.html') ? path : path + '.html';
    fs.readFile('public'+path, {encoding: 'utf8'}, function(err, data) {
      if (err) {
        response.writeHead(404);
        response.end('Sorry, could not find that');
      }
      response.end(data);
    });
  }
};

http.createServer(handleRequest).listen(3000, function() {
  console.log('server listening on port 3000');
});
