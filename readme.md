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

_More sessions coming soon..._
