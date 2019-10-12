const router = require('express').Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    database: 'ariadne',
    user: process.env.USER,
    password: process.env.PASS,
    port: 5432
})

const authorize = (req, res, next) => {
    if (!req.query.key === process.env.EXP_AUTH) {
        return res.status(401).send('Invalid authentication key');
    } else {
        next();
    }
}

// Get requests
// Get entire vocabularium
router.get('/full', (ereq, eres, next) => {
    pool.query('SELECT id, word, genus, translation, page FROM dictionary ORDER BY id ASC', (err, pres) => {
        if (err) { console.log(err) };
        eres.send(pres);
    })
});

// Get specific vocabularium (with specific start and end page)
router.get('/specific/:start/:end', (ereq, eres, next) => {
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
router.put('/add/:word', authorize, (ereq, eres, next) => {
    const { word } = ereq.params;
    const properties = {};
    Object.keys(ereq.query).forEach(key => {
        const value = ereq.query[key].replace('%2F', '/').replace('%3D', '=');
        properties[key] = value;
    });
    const { type } = properties;
    if (type === 'subst1') {
        pool.query(`INSERT INTO dictionary (word, genus, translation, page) VALUES ('${word}', '${properties.genus}', '${properties.translation}', ${properties.page})`, (err, pres) => {
            if (err) { console.log(err) };
            eres.send(pres);
        })
    }
})

// Getting works, their author, codes and properties from 'work'-table
router.get('/works', (ereq, eres, next) => {
    pool.query('SELECT * FROM works', (err, pres) => {
        if (err) { console.log(err) };
        eres.send(pres);
    })
});

module.exports = router;