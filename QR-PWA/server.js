'use strict';

const express = require('express');
let app = express();
let userAgents = [];

app.get('*', function (req, res) {
  let page = req.url;
  if (page == '') page = '/index.html';
  res.sendFile(__dirname + page);
  let currentUA = req.headers['user-agent'];
  if (userAgents.indexOf(currentUA) < 0) {
    userAgents.push(currentUA);
    console.log('User-Agent: ' + currentUA);
  }
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});