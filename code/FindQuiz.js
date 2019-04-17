var console = require("console")
var lib = require("./lib/util");
var http = require('http')
var config = require('config')
//const QUIZZES = require("./data/quizzes");

var quizInfo = [
  {title: "animals",
   meaningIds: [253432, 124410, 30629, 149517, 164079, 67149, 205358, 105890, 65977, 101607]},
  {title: "days of the week",
   meaningIds: [206025, 13752, 121, 81724, 138715, 236506, 41547]}
]

function Question(meaningId) {
  var meaning = lib.searchMeaning(meaningId);
  this.question = "How to say " + "'" + meaning[0].translation.text + "'" + " in English?";
  var temp = [];
  this.answer = Math.floor(Math.random() * 4);
  for (var i = 0; i < 4; i++)   {
   if (i == this.answer){
     temp.push(meaning[0].text)
   } else {
     temp.push(meaning[0].alternativeTranslations[i].text);
   }
  }
  this.options = temp;
}

function Quiz(title, meanings) {
  this.title = title;
  var temp = [];
  for(var i = 0; i < meanings.length; i++) {
    temp.push(new Question(meanings[i]));
  }
  this.questions = temp;
}

// FindQuiz
exports.function = function(searchTerm) {
  //You can replace with a call to a web api - make sure you map api response to Quiz model
  var quizzesJson = [];
  var userWords = lib.getWordId();
  //console.log
  if (userWords.length > 0)
    quizzesJson.push(new Quiz("my vocabulary", userWords));
  for(var i = 0; i < quizInfo.length; i++) {
    quizzesJson.push(new Quiz(quizInfo[i].title, quizInfo[i].meaningIds));
  }
  //filter based on searchTerm (note that if you use a web api then filtering can be done in the web API itself)
  if (searchTerm) {
    quizzesJson = lib.findItems(quizzesJson, searchTerm)
  }
  var quizzes = []
  //read the questions in the quiz and initialize the state
  for (var i=0; i<quizzesJson.length; i++) {
    var quiz = quizzesJson[i]
    var questions = lib.buildQuestionsFromJson(quiz)
    
    //cannot start a quiz without any questions
    if (!questions || !questions.length) {
      console.log("Chosen quiz has no questions!")
    } else {
      quiz.questions = questions
      quizzes.push(quiz)
    }
  }
  return quizzes
}
