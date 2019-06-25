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
// Get entire vocabularium
app.get('/db/full', (ereq, eres, next) => {
  pool.query('SELECT * FROM dictionary', (err, pres) => {
    if (err) { console.log(err) };
    eres.send(pres);
  })
});

// Get specific vocabularium (with specific start and end page)
app.get('/db/specific/:start/:end', (ereq, eres, next) => {
  const { start, end } = ereq.params;
  const startNum = Number(start);
  const endNum = Number(end);
  if (!startNum || !endNum) {
    return res.status(400).send();
  }
  pool.query(`SELECT * FROM dictionary WHERE page >= ${startNum} AND page <= ${endNum}`, (err, pres) => {
    if (err) { console.log(err) };
    eres.send(pres);
  })
})

// Inserting a new word into the database
app.put('/db/add/:word', (ereq, eres, next) => {
  const { word } = ereq.params;
  const properties = {};
  Object.keys(ereq.query).forEach(key => {
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

// Getting works, their author, codes and properties from 'work'-table
app.get('/db/works', (ereq, eres, next) => {
  pool.query('SELECT * FROM works', (err, pres) => {
    if (err) { console.log(err) };
    eres.send(pres);
  })
});

// Setting up a port and running app
const port = process.env.PORT || 3001;
app.listen(port);