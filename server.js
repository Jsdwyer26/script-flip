var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

//Configure bodyParser for recieving form data.
app.use(bodyParser.urlencoded({ extended: true }));
//Let bodyParser to send and recieve JSON data.
app.use(bodyParser.json());

//Serve static files from public folder.
app.use(express.static(__dirname + '/public'));

//Set view engine to hbs.
app.set('view engine', 'hbs');

//Connect to mongodb.
mongoose.connect('mongodb://localhost/english_scripts');

//Require Story model.
var Story= require('./models/story');

//API ROUTES

//GET all stories
app.get('/api/stories', function (req, res) {
  //Find all stories in db.
  Story.find(function (err, allStories) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(allStories);
    }
  });
});

//CREATE new story.
app.post('/api/stories', function (req, res){
  var newStory = new Story(req.body);

  //Save new Story in db.
  newStory.savee(function (err, savedStory){
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json(savedStory);
    }
  });
});

//GET ONE story.
app.get('/api/stories/:id', function (req, res) {
  //GET story id from url params ('req.params').
  var storyId = req.params.id;

  //Find story in db by id.
  Story.findOne({ _id: storyId }, function (err, foundStory){
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(foundStory);
    }
  });
});

//UPDATE Story.
app.put('/api/stories/:id', function (req, res) {
  //Find story from id url params ('req.params').
  Story.findOne({ _id: storyId }, function (err, foundStory) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      //Update the story's attributes.
      foundStory.title = req.body.title;
      foundStory.words = req.body.words;

      //Save updated story in db.
      foundStory.save(function (err, savedStory){
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(savedStory);
        }
      });
    }
  });
});

//DELETE story.
app.delete('/api/stories/:id', function (req, res) {
  var storyId = req.params.id;

  Story.findOneAndRemove({ _id: storyId }, function (deletedStory) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(deletedStory);
    }
  });
});

//Catch route. Sends every server-requested route to index.hbs(main layout).
app.get('*', function (req, res) {
  res.render('index');
});

//Liten on port 3000.
app.listen(3000, function() {
  console.log('listening on 3000');
});