var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');



var faves = [{id: 1, title: "Some Like it Hot", 
plot: "When two musicians witness a mob hit, they flee the state in an all female band disguised as women, but further complications set in."}];
var count = 1;


app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/search', function (req, res) {
  var query = req.query.searchTerm;
  // res.send("search page: " + query);
  var url = "http://www.omdbapi.com/?s=" + query;

  request(url, function (error, response, body) {
    if (!error) { 
      var data = JSON.parse(body);
      res.render('results.ejs', {movieList: data.Search || []});
    } 
  });
});

// show a single movie, with details
app.get('/details/:id', function (req, res) {
  var filmId = req.params.id;
  var url = "http://www.omdbapi.com/?i=" + filmId;
  
  request(url, function (error, response, body) {
  if (!error) {
    var detail = JSON.parse(body);
    res.render('movies/details.ejs', {details: detail})
    }
  });
});

//on submit, push favorites to array, show in favorites page
app.post('/favorites', function (req, res) {
 count += 1;
 var fave = req.body.details;
 faves.id = count;
 faves.push(fave);
  // faves.push({details: detailsTitle});
 res.redirect('favorites');
});


app.get('/favorites', function (req, res) {
  // res.send("favorited movie: ", {details: faves})
  // res.render('favorites/favorites.ejs');
});





app.listen(3000);
