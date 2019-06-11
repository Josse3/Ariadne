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
// Get JSON data with defined start and end page
app.get('/api/searchSpecific/:start/:end', (req, res, next) => {
  const { start, end } = req.params;
  const startNum = Number(start);
  const endNum = Number(end);
  if (!startNum || !endNum) {
    return res.status(400).send();
  }
  const keysToSend = Object.keys(dictionary).filter(key => dictionary[key].page >= startNum && dictionary[key].page <= endNum);
  const dataToSend = {};
  keysToSend.forEach(key => dataToSend[key] = dictionary[key]);
  res.send(dataToSend);
})

// Validation
app.put('/api/add/:word', (req, res, next) => {
  const { word } = req.params;
  if (!typeof word === 'string') {
    return res.status(400).send();
  }
  if (!typeof req.query === 'object') {
    return res.status(400).send();
  }
  next();
});

// Put requests
app.put('/api/add/:word', (req, res, next) => {
  const wordParam = req.params.word;
  let word;
  const slashRegExp = /%2F/g;
  const equalRegExp = /%3D/g;
  if (slashRegExp.test(wordParam)) {
    word = wordParam.replace(slashRegExp, '/');
  }

  if (equalRegExp.test(wordParam)) {
    word = wordParam.replace(equalRegExp, '=');
  }

  if (!slashRegExp.test(wordParam) && !equalRegExp.test(wordParam)) {
    word = wordParam;
  }

  const encodedupdates = req.query;
  const updates = {};
  Object.keys(encodedupdates).forEach(key => {
    if (!slashRegExp.test(key)) {
      updates[key] = encodedupdates[key];
    } else {
      updates[key] = encodedupdates[key].replace(slashRegExp, '/');
    }
  });
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