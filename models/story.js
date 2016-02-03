var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StorySchema = new Schema({
  title: String,
  words: []
});

var Story = mongoose.model('Story', StorySchema);
module.exports = Story;