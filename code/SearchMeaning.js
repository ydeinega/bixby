var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function searchMeaning (word) {
  
  var searchWordResponse = searchWord(word);
  if (searchWordResponse.length == 0)
    return [];
  var meaningId = searchWordResponse[0].meanings[0].id;
  
  var options = { 
    format: 'json',
     query: {
      ids: meaningId
    }
  };
  // If id is "1111", then this makes a GET call to /meanings?ids=1111
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
