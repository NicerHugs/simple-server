var http = require('http');
var https = require('https');
var parseURL = require('url').parse;
const etsyApiKey = '8csi9011pwlsdabu0jbn96du';

function handleRequest(request, response) {
  request.setEncoding('utf8')
  request.on('data', console.log.bind(console, 'data'));
  var term = parseURL(request.url, true).query.searchTerm;
  https.get({
    host: 'openapi.etsy.com',
    path: '/v2/listings/active?keywords=' + term + '&api_key=' + etsyApiKey
  }, function(estyResponse) {
    handleEstyData(estyResponse, response);
  });
};

function handleEstyData(data, res) {
  data.setEncoding('utf8');
  res.writeHead(data.statusCode)
  data.on('data', function (chunk) {
    res.write(chunk);
  });
  data.on('end', res.end.bind(res));
}

http.createServer(handleRequest).listen(3000, function() {
  console.log('server listening on port 3000');
});
