// Using Node.js core modules
const fs = require('fs'); //Importing the FileSystem module
const http = require('http');
const path = require('path');
const url = require('url');
const EventEmitter = require('events');
const replaceTemplate = require('./modules/replaceTemplate');

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

// Mini Project Node-Farm

const templateOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const templateCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const templateProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const nodeFarmServer = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const cardsHTML = dataObj.map((ele) => replaceTemplate(templateCard, ele)).join('');
    const output = templateOverview.replace('{%CARD%}', cardsHTML);
    res.end(output);
  }

  //Product Page
  else if (pathname === '/product') {
    const product = dataObj[query.id];
    if (!product) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('<h1>Product not found</h1>');
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  }

  //API Page
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  //Page not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello world',
    });
    res.end(`<h1>Page not found</h1>`);
  }
});

nodeFarmServer.listen(5000, '127.0.0.1', () => {
  console.log('Hello the Node farm server started.');
});

//Streams
