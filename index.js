// Using Node.js core modules
const fs = require('fs'); //Importing the FileSystem module
const http = require('http');

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
