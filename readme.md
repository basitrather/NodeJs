This repo is related my NodeJs learning and the things i have learned from it. So i am keeping track of it and it might help the upcoming devs to learn from it, as i will keep it simple and easy to understand.

# Node.js Learning Progress

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
