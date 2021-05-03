// Required modules
const http = require('http'),
  fs = require('fs'),
  url = require('url');

// Create Server
http.createServer((request, response) => {
  let addr = request.url,
  q = url.parse(addr, true),
  filePath = '';

// Set log.txt
fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Added to log.');
  }
});

if (q.pathname.includes('documentation')) {
  filePath = (__dirname + '/documentation.html');
} else {
  filePath = 'index.tml';
}

fs.readFile(filePath, (err, data) => {
  if (err) {
   throw err;
}

response.writeHead(200, { 'Content-Type': 'text/html'});
response.write(data);
response.end();
});

}).listen(8080);
console.log('My test server is running on port 8080.');