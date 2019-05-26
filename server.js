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

// Setting up a port and running app
const port = process.env.PORT || 3001;
app.listen(port);

// Get requests
// Get full JSON-file
app.get('/api/search', (request, response) => {
  response.send(dictionary);
});

// Post requests
// Substantives first declension
app.get('/api/add/subst1/:word/:genus/:translation/:page', postSubst1);

function postSubst1(request, response) {
  const { word, genus, translation, page } = request.params;
  let reply;
  // Error handling
  if (word && genus && translation && page) {
    dictionary[word] = {
      genus,
      translation,
      page
    }
    // Sending back information with "response: 'ok'"
    reply = {
      word,
      genus,
      translation,
      page,
      response: 'ok'
    }
    // Saving data to JSON file
    const dataToSend = JSON.stringify(dictionary, null, 2);
    fs.writeFile('dictionary.json', dataToSend, sent);

    function sent() {
      // Empty, same as dataGotten()
    }
  }
  // Sending response
  response.send(JSON.stringify(reply));
}
