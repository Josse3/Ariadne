// Importing Node extensions
const fs = require('fs');
const express = require('express');

// Creating a new express api
const app = express();

// Importing data
const rawData = fs.readFileSync('./dictionary.json', dataGotten);
const dictionary = JSON.parse(rawData);

function dataGotten() {
  // empty because express wants me to have it but my terminal crashes whenever I console.log() something ¯\_(ツ)_/¯
}

// Get requests
// Get full JSON-file
app.get('/api/search', (req, res, next) => {
  res.send(dictionary);
});

// Put requests
app.put('/api/add/:word', (req, res, next) => {
  const { word } = req.params;
  const updates = req.query;
  if (word) {
    updates.page = Number(updates.page);
    dictionary[word] = updates;
    fs.writeFile('dictionary.json', JSON.stringify(dictionary, null, 2), (err) => {
      if (err) {
        console.log(err);
      }
    })
    res.status(201).send(dictionary[word]);
  } else {
    res.status(400).send();
  }
})

// Setting up a port and running app
const port = process.env.PORT || 3001;
app.listen(port);