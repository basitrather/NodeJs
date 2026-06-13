// Using Node.js core modules
const fs = require('fs'); //Importing the FileSystem module
const http = require('http');
const url = require('url');

////////////////////////
// Files

// Sync version of file system:-
// Reading from the file:
const textInput = fs.readFileSync('./txt/input.txt', 'utf-8'); //Reading from the file.

// Reading from the file:
const textOutput = `File created successfully🥳`;
fs.writeFileSync('./txt/output.txt', textOutput); // creating a new file and writing on it.

// Async version of file system:-
// Reading from the file:
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  if (err) return console.log(`File doesn't exist...`); // If error happens do this

  //This gets excuted in background while the other code is being executed in the realtime.
  console.log(data);
  fs.writeFile(`./txt/final.txt`, data, 'utf-8', (err) => {
    //Here file gets written in background and runs after the first callback is done.
  });
});
console.log('I ran first:)'); // Logs first :/

////////////////////////

// SERVER

// Creating a simple server
const server = http.createServer((req, res) => {
  res.end('Hello, Welcome to the server');
}); // Created a server using http module and stored the server in a variable

//Now listening to the server or startint it
server.listen('8000', '127.0.0.1', () => {
  console.log('Hello the server started on localHost');
}); //First one is port and second is localHost address

//ROUTING: Implementing different actions on different URL.

const routingServer = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/home') {
    res.end("Hello, It's the homepage"); //Only send if the URL is http://127.0.0.1:8000/ or http://127.0.0.1:8000/home
  } else if (req.url === '/product') {
    res.end(`Hello, it's the product page`); //Only send if the URL is http://127.0.0.1:8000/ or http://127.0.0.1:8000/product
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello world',
    }); //Header of the response. shows the status code and other info
    res.end(`<h1>Page not found</h1>`); //Send this when wrong url
  }
});

//Now listening to the server or startint it
routingServer.listen(6000, '127.0.0.1', () => {
  console.log('Hello the server started on localHost');
});
