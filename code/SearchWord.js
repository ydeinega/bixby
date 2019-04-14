var http = require('http')
var console = require('console')
var config = require('config')

module.exports.function = function searchWord (word) {
  console.log("SearchWord in a dictionary")
  var options = { 
    format: 'json',
     query: {
      search: word
    }
  };
  // If word is "apple", then this makes a GET call to /search?search=apple
  var response = http.getUrl(config.get('remote.url') + '/search', options);
  response[0].meanings[0].imageUrl = "https:" + response[0].meanings[0].imageUrl;
  console.log(response[0].meanings[0].imageUrl);
  return response;
}
