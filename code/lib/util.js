var console = require("console")
var http = require('http')//my code
var config = require('config')//my code


exports.findItems = findItems
exports.buildQuestionsFromJson = buildQuestionsFromJson
exports.searchMeaning = searchMeaning
exports.getWordId = getWordId

function findItems(items, searchTerm) {
   var matches = []
   //a lot can be improved here...
   for (var i=0; i<items.length; i++) {
      if (items[i].tags) {
        for (var j=0; j<items[i].tags.length; j++) {
          if (searchTerm.toLowerCase() == items[i].tags[j].toLowerCase()) {
             matches.push(items[i])
             break
          }
        }
      }
   }
   return matches
}

function buildQuestionsFromJson(quizJson) {
  var questions = []
  for (var i=0; i<quizJson.questions.length; i++) {
    questions.push(buildQuestionFromJson(quizJson.questions[i], i))
  }
  return questions
}

function buildQuestionFromJson(questionJson, index) {
    if (!questionJson) {
        return null
    }
    var options = []
    if (questionJson.options) {
      for (var i=0; i<questionJson.options.length; i++) {
        options.push({
          text: questionJson.options[i],
          alias: String.fromCharCode('A'.charCodeAt(0) + i)
        })
      }
    }
    var question = {
      textToDisplay: questionJson.question,
      textToSpeak: buildQuestionToSpeak(questionJson.question, options),
      options: options,
      index: index,
      correctAnswer: {
         acceptedAnswers: buildAcceptedAnswers(questionJson.answer, options),
         explanation: questionJson.explanation
      }
    }
    return question
}

function buildQuestionToSpeak(question, options) {
  optionsString = ''
  for (var i=0; i<options.length; i++) {
    optionsString += options[i].alias + '... ' + options[i].text + (i+1 < options.length ? ', ... ' : '')
  }
  return question + ' ' + optionsString
}

function buildAcceptedAnswers(answer, options) {
   var acceptedAnswers = []
   if (Array.isArray(answer)) { //is answer an array?
     for (var i=0; i<answer.length; i++) {
        acceptedAnswers = acceptedAnswers.concat(buildAcceptedAnswers(answer[i], options))
     }
   } else if (typeof answer === 'number' && options && answer < options.length) {
     acceptedAnswers.push(options[answer].alias)
     acceptedAnswers.push(options[answer].text)
   } else if (answer) {
     acceptedAnswers.push(answer)
     //also push all aliases matching the answer
     if (options) {
       for (var i=0; i<options.length; i++) {
         if (options[i].text == answer) {
           acceptedAnswers.push(options[i].alias)
         }
       }
     }
   }
   return acceptedAnswers
}

//my code starts here
function searchMeaning (meaningId) {
  
  var options = { 
    format: 'json',
     query: {
      ids: meaningId
    }
  };
  // If id is "1111", then this makes a GET call to /meanings?ids=1111
  var response = http.getUrl(config.get('remote.url') + '/meanings', options);
  //meaningResponse[0].images[0].
  return response;
}

function getWordId() {
  var db_name = "bixby_jdv";
  var ContactId = 121212;
  var myAPIKEY = 'jc13HjwDduIPNOgu1tSxz3BT_CNuDx4H';
  
  var options = {
    format: 'json',
  };
  var res =[]
  
  var resp = http.getUrl('https://api.mlab.com/api/1/databases/' + db_name + '/collections/' + ContactId + '?apiKey=' + myAPIKEY, options);
  for (var i = 0; i < resp.length; i++)
  {
    res.push(resp[i].id_word)
  }
  console.log(res);
  return res;
}

