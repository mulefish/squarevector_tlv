
const { cyan, colors, importantMsg, COMMON_THINGS } = require("./logic/library.js")
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("./" + COMMON_THINGS.DB_NAME)
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
  }
}));


app.get('/about', (req, res) => {
  cyan("about.html")
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/fakeSwagger', (req, res) => {
  cyan("fakeSwagger")
  const routes = [];

  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods);
      const path = middleware.route.path;
      methods.forEach(method => routes.push({ method: method.toUpperCase(), path: path }));
    }
  });
  res.json( routes )
})

app.get('/', (req, res) => {
  cyan("main.html")
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.listen(port, () => {
  importantMsg(`Server is running`, `http://localhost:${port}`);
});
