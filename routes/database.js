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
    pool.query('SELECT id, word, genus, genitive, translation, page FROM dictionary ORDER BY id ASC', (err, pres) => {
        if (err) { console.log(err) };
        eres.send(pres.rows);
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
        const value = decodeURIComponent(ereq.query[key]);
        properties[key] = value;
    });
    const { type } = properties;
    if (type === 'subst1') {
        pool.query(`INSERT INTO dictionary (id, word, genus, translation, page) VALUES (${properties.id}, '${word}', '${properties.genus}', '${properties.translation}', ${properties.page})`, (err, pres) => {
            if (err) { console.log(err) };
            eres.send(pres);
        })
    }
})

// Updating an existing work inside the database
router.put('/update/:id', authorize, (ereq, eres) => {
    const updates =
        Object.entries(ereq.query).map(([key, value]) => {
            const SQLValue = Number.isNaN(Number(value)) ? `'${value}'` : value;
            return key + ' = ' + SQLValue;
        })
            .join(', ');

    const query = {
        text: `UPDATE dictionary SET ${updates} WHERE id = $1`,
        values: [ereq.params.id]
    }

    pool.query(query, err => {
        if (err) throw err;
    });
})

// Deleting a word from the database
router.delete('/delete/:id', authorize, async (ereq, eres) => {
    // Delete from database
    pool.query(`DELETE FROM dictionary WHERE id = $1`, [ereq.params.id], (err, pres) => {
        if (err) throw err;
    })
    // Decrement id of all following words by 1
    const followingRows = await pool.query('SELECT id FROM dictionary WHERE id > $1', [ereq.params.id])
        .then(pres => {
            return pres.rows;
        })
        .catch(error => console.log(error));

    if (followingRows !== undefined) {
        followingRows.forEach(row => {
            pool.query('UPDATE dictionary SET id = $1 WHERE id = $2', [row.id - 1, row.id])
                .catch(error => console.log(error))
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