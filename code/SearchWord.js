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
  var response = http.getUrl(config.get('remote.url') + '/words/search', options);
  return response;
}
