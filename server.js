// server.js
// where your node app starts

// init project
require('dotenv');

var express = require('express');
var app = express();

var google_images = require('google-ims');
var cse_id = process.env.CSE_ID;
var cse_api_key = process.env.CSE_API_KEY;
var cse_client = google_images(cse_id, cse_api_key);

var mongo = require('mongodb').MongoClient;
var dbuser = ""+process.env.DB_USER;
var dbpass = ""+process.env.DB_PASS;
var dbstring = 'mongodb://'+ dbuser + ':' + dbpass + '@ds129166.mlab.com:29166/image-search-abs'

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.get('/', function(req, res){
   res.sendFile(__dirname + '/views/index.html');
});
app.get('/search/:qstring', function(req, res){
  
  var qString = req.params.qstring;
  var offset = req.query.offset && req.query.offset <= 10 && req.query.offset >= 1? req.query.offset : 10;
  var date_created = new Date().toISOString();
  var simplified_date = date_created.slice(0, date_created.indexOf('T'));
  
  cse_client.search(qString, {num: offset})
    .then(function(images){
      console.log("images collected");
    
      if(images){
        mongo.connect(dbstring, function(err, db){
          db.collection("searches").insert([{search: qString, date: simplified_date, list_size: offset}], function(){
            db.close();
            res.json(images);
          })  
        })
      }
    })
    .catch(function(err){
      res.json({error: err, status: 500});
    })
})
app.get('/history', function(req, res){
  mongo.connect(dbstring, function(err, db){
    db.collection('searches').find({}, {_id: 0}).limit(10).toArray(function(err, hist){
      if(err){
        db.close();
        res.json({error: "error retrieving history", status: 500});
      }
      else if(hist.length === 0){
        db.close();
        res.json({Message: "No searches have been made yet", status: 404})
      }
      else{
        db.close();
        res.json(hist);
      }
    })
  })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
