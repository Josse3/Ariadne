const router = require('express').Router();
require('dotenv').config();

router.get('/addtool', (req, res) => res.send(req.query.password === process.env.EXP_AUTH));

module.exports = router;