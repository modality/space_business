console.log('Running Space Business Tweet Generator');

var args = process.argv.slice(2);
var Twitter = require('twitter');
var _ = require('underscore');
var SpaceData = require('./data');
var HeadlineData = require('./headlines');
var ApiKeys = require('./api_keys')

String.prototype.supplant = function (o) {
  return this.replace(/{([^{}]*)}/g,
    function (a, b) {
      return o[b]();
    }
  );
};

var generators = {
  "MATERIAL": function() {
    return [_.sample(SpaceData.goodAdjective), _.sample(SpaceData.goodSingular)].join(' ');
  },
  "MATERIALS": function() {
    return [_.sample(SpaceData.goodAdjective), _.sample(SpaceData.goodPlural)].join(' ');
  },
  "NUMBER": function() {
    return Math.ceil(Math.random() * 20).toString();
  },
  "NUMBERS": function() {
    return (Math.ceil(Math.random() * 20)+1).toString();
  },
  "COMPANY": function() {
    return [_.sample(SpaceData.pirateNames), _.sample([
      'Ltd.', 'LLC', 'Corp', 'Co.', 'Inc.', 'Ultd.'
    ])].join(' ');
  },
  "PLACE": function() {
    return [_.sample(SpaceData.sectorTitle), _.sample(SpaceData.sectorSubtitle)].join(' ');
  },
  "TIMESPAN": function() {
    return Math.ceil(Math.random() * 100).toString() + " Msec";
  },
  "DATE": function() {
    return [
      (17300 + (Math.ceil(Math.random() * 500))),
      ".",
      Math.floor(Math.random() * 100),
      ".",
      Math.floor(Math.random() * 100),
      " UE"
    ].join('');
  },
  "FACTORY": function() {
    return _.sample(["plant", "mine", "factory", "branch", "lab", "depot", "HQ", "venture"]);
  },
  "CONTRACT": function() {
    return _.sample(SpaceData.contractTerms);
  }
}

function getHeadline() {
  var template = _.sample(HeadlineData);
  return template.supplant(generators);
}

if(args[0] && args[0] == "tweet") {
  var client = new Twitter(ApiKeys);
  var headline = getHeadline();
  while(headline.length > 140) {
    headline = getHeadline();
  }
  
  client.post('statuses/update', {status: headline},  function(error, tweet, response){
    if(error) throw error;
    console.log(tweet);  // Tweet body. 
    console.log(response);  // Raw response object. 
  });

} else {
  for(var i=0;i<20;i++) {
    console.log(getHeadline());
  }
}
