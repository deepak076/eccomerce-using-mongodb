// app.js
const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

  app.use((req, res, next) => {
    User.findById('668c0336727aca96d8e0cf56')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    User.findOne().then(user=>{
      if(!user){
        const user = new User({
          name: 'Deepak',
          email: 'deepak@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();

      }
    })
    console.log('Connected to MongoDB');
    app.listen(3000);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
