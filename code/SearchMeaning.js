var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function searchMeaning (word) {
  
  var searchWordResponse = searchWord(word);
  if (searchWordResponse.length == 0)
    return [];
  var meaningId = searchWordResponse[0].meanings[0].id;
  var db_name = "bixby_jdv";
  var ContactId = 121212;
  var myAPIKEY = 'jc13HjwDduIPNOgu1tSxz3BT_CNuDx4H';

  var params = {
    'id_word': meaningId
  };
  var options = { 
    format: 'json',
    passAsJson: true,
  };
    var postWord = http.postUrl("https://api.mlab.com/api/1/databases/" + db_name + "/collections/" + ContactId + '?apiKey=' + myAPIKEY, params, options);
  console.log(postWord)
  
  // If id is "1111", then this makes a GET call to /meanings?ids=1111
  options = { 
    format: 'json',
    query: {
      ids: meaningId
    }
  };
  var response = http.getUrl(config.get('remote.url') + '/meanings', options);
  return response;
}

function searchWord (word) {
  console.log("SearchWord in a dictionary")
  var options = { 
    format: 'json',
     query: {
      search: word
    }
  };
  // If word is "apple", then this makes a GET call to /search?search=apple
  var response = http.getUrl(config.get('remote.url') + '/words/search', options);
  return response;
}
