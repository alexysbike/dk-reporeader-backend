// Created by Alexys Gonzalez (DK)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/github-login', async (req, res) => {
  const {code, state} = req.body;
  if (!code || !state) {
    res.status(400).json({
      error: 'Missing required fields (code, state)'
    });
  } else {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      code,
      state,
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET
    });
    const json = response.data.split('&').reduce((acum, piece) => {
      const [key, value] = piece.split('=');
      return {...acum, [key]: value};
    }, {});
    res.json(json);
  }
});

app.listen(3100);

console.log('Listening on 3100');