'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV } = require('./config');
const movies = require('./movies');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, {
  skip: () => process.env.NODE_ENV === 'test'
}));
app.use(helmet());
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

app.use(function ErrorHandler(error, req, res, next) {
  let response;
  if(NODE_ENV === 'production'){
    response = { error: { message: 'server error' } };
  }
  else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.get('/movie', (req,res) => {
  const query = req.query; 
  const genre= query.genre;
  const country= query.country;
  const avg_vote= parseInt(query.avg_vote, 10);
  let results = [];

  if(genre){
    results = movies.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if(country){
    results = movies.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  if(avg_vote){
    results = movies.filter(movie => movie.avg_vote >= avg_vote);
  }

  res.json(results);
});

module.exports = app;
