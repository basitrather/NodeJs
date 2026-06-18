This repo is related my NodeJs learning and the things i have learned from it. So i am keeping track of it and it might help the upcoming devs to learn from it, as i will keep it simple and easy to understand.

# Node.js Learning Progress

> Course: [Node.js, Express, MongoDB Bootcamp](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) by Jonas Schmedtmann

---

## 📅 Session 1

### 1. What is Node.js?

- JS runtime that runs **outside the browser**, built on Chrome's V8 engine
- **Browser JS** = DOM manipulation only (sandboxed, no system access)
- **Node.js** = System access (files, databases, network etc) but **no DOM**

### 2. Core Modules

- Built-in modules, no installation needed
- Loaded using `require()`:

```js
const fs = require('fs');
const http = require('http');
```

### 3. Reading & Writing Files (`fs` module)

**Synchronous (blocking)** — code stops and waits:

```js
const data = fs.readFileSync('./file.txt', 'utf-8');
fs.writeFileSync('./output.txt', 'Hello!');
```

**Asynchronous (non-blocking)** — uses a callback when done:

```js
fs.readFile('./file.txt', 'utf-8', (err, data) => {
  if (err) return console.log('Error!');
  console.log(data);

  fs.writeFile('./output.txt', data, 'utf-8', (err) => {
    if (err) return console.log('Error writing file');
    console.log('File written successfully ✅');
  });
});
```

### 4. Async Nature & Event Loop

- **Event loop** — mechanism that keeps Node running and picks up tasks when they're ready
- **Callback** — a function passed as an argument to another function, executed when the task is done
- **Never block the event loop** — blocking freezes the server for all users

```
[Your Code] → calls async function with callback
      ↓
[Background Thread] → does heavy work (file read, DB query)
      ↓
[Callback Queue] → callback is placed here when work is done
      ↓
[Event Loop] → picks up callback and executes it
```

### 5. Creating a Web Server (`http` module)

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello from the server!');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server running on port 8000...');
});
```

- `req` = incoming request object (`req.url`, `req.method`)
- `res` = response sent back to the client
- `127.0.0.1` = localhost (this machine)
- Port below `1024` are reserved — use `3000`, `8000`, `8080` etc for development

### 6. Routing

```js
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/home') {
    res.end('Welcome to the homepage');
  } else if (req.url === '/about') {
    res.end('This is the about page');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>Page not found</h1>');
  }
});
```

- `req.url` — tells you which route was requested
- `res.writeHead(statusCode, headers)` — sets status code and headers
- Always handle unknown routes with a `404`

### 7. HTTP Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | OK (success) |
| 201  | Created      |
| 301  | Redirect     |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 500  | Server Error |

---

## 📅 Session 2

### 8. HTML Templating

Instead of hardcoding HTML in `res.end()`, use template files with placeholders that get replaced with real data dynamically.

**Placeholders in HTML:**

```html
<h1>{%NAME%}</h1>
<p>Price: {%PRICE%}</p>
```

**Replacing placeholders in Node:**

```js
// Read templates once at startup (outside server)
const templateOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const templateCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const templateProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');

// Replace function
const replaceTemplate = (template, product) => {
  let output = template.replace(/{%NAME%}/g, product.productName);
  output = output.replace(/{%PRICE%}/g, product.price);
  // /g flag = replace ALL occurrences not just first
  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

// Generate all cards using map + join
const cardsHTML = dataObj.map((ele) => replaceTemplate(templateCard, ele)).join('');
const output = templateOverview.replace('{%CARD%}', cardsHTML);
res.end(output);
```

- `.map()` — transforms array into new array (use over `.forEach()` when you need a new array)
- `.join('')` — combines array items into a single string
- Read templates **outside** the server so they're not re-read on every request

### 9. URL Parsing & Query Strings

```js
const url = require('url');

const { query, pathname } = url.parse(req.url, true);
// pathname = '/product'
// query = { id: '0' }

// Look up specific product
const product = dataObj[query.id];
```

- `pathname` — the path without query string
- `query` — query parameters as a JS object
- Always handle case where data doesn't exist (defensive programming):

```js
if (!product) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  return res.end('<h1>Product not found</h1>');
}
```

### 10. Own Modules (`module.exports` & `require`)

Split code into separate files for reusability, maintainability and readability.

**Exporting (replaceTemplate.js):**

```js
module.exports = (template, product) => {
  // function code here
};
```

**Importing (index.js):**

```js
const replaceTemplate = require('./modules/replaceTemplate');
```

**How Node resolves `require()`:**

1. Starts with `./` or `../` → looks for your own file
2. No `./` → checks if it's a core module (`fs`, `http` etc)
3. Not a core module → looks in `node_modules` (third party packages)

### 11. NPM & `package.json`

```bash
npm init          # creates package.json
npm install       # installs all dependencies from package.json
```

**`package.json`** — identity card of your project, tracks all dependencies.
**`node_modules`** — where installed packages live. Always add to `.gitignore`.
**`package-lock.json`** — locks exact versions. Never edit manually.

### 12. Types of Packages

```bash
npm install express          # regular dependency (needed in production)
npm install nodemon --save-dev  # dev dependency (only needed in development)
```

- **`dependencies`** — packages app needs to run in production
- **`devDependencies`** — packages only needed during development, not installed in production

**Nodemon** — watches files and auto-restarts server on save. Add to scripts:

```json
"scripts": {
    "start": "nodemon index.js"
}
```

```bash
npm start       # works (start is a reserved script name)
npm run start   # also works
npm run dev     # must use 'run' for custom script names
```

### 13. Package Versioning

```
1  .  2  .  3
↑     ↑     ↑
MAJOR MINOR PATCH

MAJOR → breaking changes, not backward compatible
MINOR → new features, backward compatible
PATCH → bug fixes only
```

**Version symbols in `package.json`:**

```
^1.2.3  →  accept latest MINOR and PATCH (most common)
~1.2.3  →  accept latest PATCH only
1.2.3   →  exact version only
```

---

## 📅 Session 3

### 14. How the Web Works

```
You (Client/Browser)
        |
        | 1. DNS Lookup — domain name → IP address
        | 2. TCP/IP Connection (handshake)
        | 3. HTTP Request sent
        ↓
     Server
        | 4. Server processes request
        | 5. HTTP Response sent back
        ↓
You (Client/Browser)
        | 6. Browser renders HTML
        | 7. More requests sent for CSS/JS/images
        | 8. Page fully loads
```

- **DNS** — converts domain names to IP addresses (like a phone book)
- **TCP/IP** — protocol governing how data travels across the internet
- **HTTP** — language client and server use to communicate
- **HTTPS** — HTTP + TLS (Transport Layer Security) encryption, protects against man-in-the-middle attacks

### 15. HTTP in Action

**HTTP Request structure:**

```
GET /overview HTTP/1.1          ← method + path + version
Host: www.example.com           ← headers
User-Agent: Mozilla/5.0
                                 ← body (only for POST/PUT)
```

**HTTP Response structure:**

```
HTTP/1.1 200 OK                 ← version + status code + message
Content-Type: text/html         ← headers

<html>...</html>                ← body
```

**HTTP Methods:**
| Method | Purpose |
|--------|---------|
| GET | Retrieve data |
| POST | Send/create data |
| PUT | Update data (whole) |
| PATCH | Update data (partial) |
| DELETE | Delete data |

### 16. Frontend vs Backend

|            | Frontend         | Backend                  |
| ---------- | ---------------- | ------------------------ |
| Runs on    | Browser          | Server                   |
| Tech       | HTML, CSS, JS    | Node.js, Python, PHP etc |
| Deals with | UI, interactions | Business logic, DB, APIs |

### 17. Static vs Dynamic vs API

| Type    | Has Server? | Has Database? | What it sends?                                 |
| ------- | ----------- | ------------- | ---------------------------------------------- |
| Static  | ❌          | ❌            | Pre-built HTML                                 |
| Dynamic | ✅          | ✅            | Server-generated HTML                          |
| API     | ✅          | ✅            | JSON data (consumable by web, mobile, IoT etc) |

---

### 18. Node, V8, Libuv and C++

```
Your JavaScript Code
        ↓
┌─────────────────────────────┐
│         NODE.JS             │
│  ┌──────────┐ ┌──────────┐ │
│  │    V8    │ │  LIBUV   │ │
│  │(JS + C++)│ │  (C++)   │ │
│  └──────────┘ └──────────┘ │
│  + other C++ libs            │
│  (crypto, zlib, http_parser) │
└─────────────────────────────┘
        ↓
   Machine Code
```

- **V8** — compiles JS into machine code
- **Libuv** — gives Node async, non-blocking I/O; handles event loop & thread pool
  > V8 runs your JavaScript, Libuv gives it superpowers (async I/O, event loop), together they make Node.js.

### 19. Processes, Threads & Thread Pool

- **Process** — a running instance of a program (e.g. `node index.js`)
- **Thread** — a worker inside the process; Node's main thread runs one thing at a time ("single-threaded")
- **Thread Pool** — background threads (managed by libuv) that handle heavy tasks without blocking the main thread

```
Main Thread (Event Loop)
        |
        | heavy task (file read, crypto, compression)
        ↓
┌─────────────────────────┐
│ Thread Pool: T1 T2 T3 T4 │  ← 4 threads by default (max 128)
└─────────────────────────┘
        |
        | task done → callback → event loop
        ↓
Main Thread continues
```

```js
process.env.UV_THREADPOOL_SIZE = 8; // increase thread pool size
```

| Goes to Thread Pool | Stays on Main Thread |
| ------------------- | -------------------- |
| File system ops     | Network requests     |
| Crypto              | Regular JS code      |
| Compression (zlib)  | Timers               |

### 20. The Event Loop (Phases)

```
┌─────────────────────────────────┐
│  1. TIMERS (setTimeout/Interval) │
│  2. I/O CALLBACKS                │
│  3. IDLE, PREPARE (internal)     │
│  4. POLL (retrieve I/O events)   │
│  5. CHECK (setImmediate)         │
│  6. CLOSE CALLBACKS              │
│  → loops back to start           │
└─────────────────────────────────┘
```

- `process.nextTick()` and Promise callbacks run **before** every phase (highest priority)
- Synchronous code always runs first, then microtasks (Promises), then event loop phases

**Execution order example:**

```js
console.log('1 - start'); // sync
setTimeout(() => console.log('4 - timer'), 0); // timers phase
setImmediate(() => console.log('3 - immediate')); // check phase
Promise.resolve().then(() => console.log('2 - promise')); // microtask
console.log('5 - end'); // sync

// Output: 1 - start, 5 - end, 2 - promise, 3 - immediate, 4 - timer
```

- **Inside an I/O callback**, `setImmediate` always runs before `setTimeout`

### 21. Events & Event-Driven Architecture

Node's core modules (`http`, `fs`, streams) are built on this pattern: **emitter** fires an **event**, a **listener** catches it and runs a **callback**.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// Listener (set up BEFORE emitting)
myEmitter.on('newSale', (stock) => {
  console.log(`Remaining stock: ${stock}`);
});

// Emitter
myEmitter.emit('newSale', 9);
```

- `.on()` — runs every time the event is emitted
- `.once()` — runs only the first time, then removes itself
- Multiple listeners can listen to the same event
- Listeners must be set up **before** the event is emitted

```js
// Under the hood, http.createServer is event-driven:
const server = http.createServer();
server.on('request', (req, res) => res.end('Hello!'));
```

### 22. Streams

Instead of reading/writing an entire file before responding (slow, memory-heavy), streams process data in **small chunks**, sending each chunk as soon as it's ready.

**Four types of streams:**
| Type | Description | Example |
|------|-------------|---------|
| Readable | Read data chunk by chunk | `fs.createReadStream()` |
| Writable | Write data chunk by chunk | `fs.createWriteStream()` |
| Duplex | Both readable and writable | Network sockets |
| Transform | Duplex that transforms data | Compression (zlib) |

**Readable stream events:**

```js
const readable = fs.createReadStream('./big-file.txt', 'utf-8');

readable.on('data', (chunk) => res.write(chunk)); // fires per chunk
readable.on('end', () => res.end()); // fires when done
readable.on('error', (err) => console.log(err)); // fires on error
```

**Piping — solves the backpressure problem (matches read/write speed automatically):**

```js
const readable = fs.createReadStream('./big-file.txt');
readable.pipe(res); // reads & writes chunks, no manual event handling needed
```

### 23. How Requiring Modules Really Works

When you call `require('./myModule')`, Node does the following:

1. **Resolving** — figures out exact file path
2. **Loading** — loads file content as a string
3. **Wrapping** — wraps your code in a function:

```js
(function (exports, require, module, __filename, __dirname) {
  // your code lives here
});
```

This is why `require`, `module`, `exports`, `__filename`, `__dirname` are available in every file without importing them — they're parameters of this wrapper.

4. **Evaluating** — runs the wrapped function
5. **Caching** — once required, Node **caches** the module. Requiring it again elsewhere returns the cached result instead of re-running the file:

```js
// file1.js
console.log('Runs only once!');
module.exports = 'hello';

const a = require('./file1'); // prints "Runs only once!"
const b = require('./file1'); // nothing prints — cached
```

**Useful hidden variables:**

```js
console.log(__filename); // full path of current file
console.log(__dirname); // full path of current directory (avoids path bugs)
```

---

_More sessions coming soon..._
