// Requiring + setting up server
const express = require('express');
const app = express();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  database: 'ariadne',
  user: process.env.USER,
  password: process.env.PASS,
  port: 5432
})

// Get requests
// Get full database 
app.get('/db/full', (ereq, eres, next) => {
  pool.query('SELECT * FROM dictionary', (err, pres) => {
    if (err) { console.log(err) };
    eres.send(pres);
  })
});

// Get JSON data with defined start and end page
app.get('/api/searchSpecific/:start/:end', (ereq, eres, next) => {
  const { start, end } = req.params;
  const startNum = Number(start);
  const endNum = Number(end);
  if (!startNum || !endNum) {
    return res.status(400).send();
  }
  pool.query(`SELECT * FROM dictionary WHERE page <= ${startNum} AND page >= ${endNum}`, (err, pres) => {
    if (err) { console.log(err) };
    eres.send(pres);
  })
})

// Put requests
app.put('/db/add/:word', (ereq, eres, next) => {
  const { word } = ereq.params;
  const properties = {};
  Object.keys(ereq.query).forEach(key => {
    // let value = Number(ereq.query[key]) === NaN ? Number(ereq.query[key]) : ereq.query[key];
    const value = ereq.query[key].replace('%2F', '/').replace('%3D', '=');
    properties[key] = value;
  });
  console.log(word, properties);
  const { type } = properties;
  console.log(type);
  if (type === 'subst1') {
    pool.query(`INSERT INTO dictionary (word, genus, translation, page) VALUES ('${word}', '${properties.genus}', '${properties.translation}', ${properties.page})`, (err, pres) => {
      if (err) { console.log(err) };
      eres.send(pres);
    })
  }
})

// Setting up a port and running app
const port = process.env.PORT || 3001;
app.listen(port);