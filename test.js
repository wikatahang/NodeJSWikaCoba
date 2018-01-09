const express = require ('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var promise = mongoose.connect('mongodb://localhost/tes',{
  useMongoClient: true
});
let db = mongoose.connection;

//check connection
db.once('openUri', function(){
  console.log('connected to mongoDB');
})

//check for db errors
db.on('error', function(err){
  console.log(err);
});

//init app
const app = express();

//bring model
let articles = require('./models/article');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//home route
app.get ('/', function(req, res){
  articles.find({},function(err, articles){
    if(err){
      console.log(err);
    }
    else{
      res.render('index', {
        "title": 'Coba',
        "article": articles
      });
    }
  });
});

//add route
app.get ('/plus', function(req, res) {
  res.render('plus', {
    title: 'add route'
  });
})

//add submit POST route
app.post('/plus', function(req, res){
  let articles01 = new articles();
  articles01.title = req.body.title;
  articles01.author = req.body.author;
  articles01.body = req.body.body;      //install body-parser

  articles01.save(function(err){
    if(err){
      console.log(err);
      return
    }
    else {
      res.redirect('/')
    }
  })

})

//server start
app.listen(3000,function(){
  console.log('Server star in port 3000');
})
