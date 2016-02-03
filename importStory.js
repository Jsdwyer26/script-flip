var mongoose = require('mongoose');
//Connect w/ db. 
mongoose.connect('mongodb://localhost/english_scripts');
//Require Story model.
var Story = require('./models/story');

var theLittleEngine = "A little railroad engine was employed about a station yard for such work as it was built for, pulling a few cars on and off the switches. One morning it was waiting for the next call when a long train of freight-cars asked a large engine in the roundhouse to take it over the hill. 'I can't; that is too much a pull for me', said the great engine built for hard work. Then the train asked another engine, and another, only to hear excuses and be refused. In desperation, the train asked the little switch engine to draw it up the grade and down on the other side. 'I think I can', puffed the little locomotive, and put itself in front of the great heavy train. As it went on the little engine kept bravely puffing faster and faster, 'I think I can, I think I can, I think I can.' As it neared the top of the grade, which had so discouraged the larger engines, it went more slowly. However, it still kept saying, 'I—think—I—can, I—think—I—can.' It reached the top by drawing on bravery and then went on down the grade, congratulating itself by saying, 'I thought I could, I thought I could.'";

var aLittleFable = "‘Alas,' said the mouse, 'the whole world is growing smaller every day. At the beginning it was so big that I was afraid, I kept running and running, and I was glad when I saw walls far away to the right and left, but these long walls have narrowed so quickly that I am in the last chamber already, and there in the corner stands the trap that I must run into.’ 'You only need to change your direction,' said the cat, and ate it up.";

//POS.
var pos = require('pos');
//Pass in story here.
var words = new pos.Lexer().lex(aLittleFable);
var tagger = new pos.Tagger();
var taggedWords = tagger.tag(words);

var checkedText = [];

for (var i in taggedWords) {
  var taggedWord = taggedWords[i];
  var word = taggedWord[0];
  var tag = taggedWord[1];
  //Tagging nouns, setting to variables.
  if (tag == 'NN' || tag == 'NNP' || tag == 'NNPS') {
    tag = 'var ' + word + ';';
    checkedText.push([word, tag]);
  } else if (tag == 'VB' || tag == 'VBD' || tag == 'VBG' || tag == 'VBN' || tag == 'VBP' || tag == 'VBZ') {
    tag = 'function ' + word + '() {};';
    checkedText.push([word, tag]);
  } else {
    checkedText.push(word);
  }
}

console.log('saving json story');

Story.create({
  title: 'aLittleFable',
  words: checkedText
}, function(err, small) {
  if (err) return handleError(err);
  console.log('saved');
});

/* 
NOUNS 
NN Noun, sing. or mass      dog
NNP Proper noun, sing.      Edinburgh
NNPS Proper noun, plural    Smiths
NNS Noun, plural            dogs
PP$ Possessive pronoun      my,one�s
PRP Personal pronoun         I,you,she

VERBS
VB verb, base form          eat
VBD verb, past tense        ate
VBG verb, gerund            eating
VBN verb, past part         eaten
VBP Verb, present           eat
VBZ Verb, present           eats

CONDITIONALS/LOOPS
PDT Predeterminer           all, both
CC Coord Conjuncn           and,but,or

ITERATIONS(?)
MD Modal                    can,should

*/