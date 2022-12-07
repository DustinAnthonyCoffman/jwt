const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://Dustin:qmk22lpnEkmubKSb@cluster0.neknura.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);

//cookies
//we need to store a generated jwt from a post request into a cookie
app.get('/set-cookies', (req, res) => {
  res.cookie('newUser', false);
  //setting a cookie to expire after a full day 100 * 60 etc.
  //in production we should only use cookies over https and they shouldnt be modified by client side
  res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24 });

  res.send('you got a cookie');
});

app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies;
  res.json(cookies);
});