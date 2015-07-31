var monk = require('monk');
var db = monk(process.env.CUSTOMCONNSTR_MONGOLAB_URI||'localhost/db')
var links = db.get('links');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var storeURLs = function(url,title, baseUrl, callback) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  var shortenedURL = shasum.digest('hex').slice(0,5);

  links.find({url: url}, function(err, result) {
    if (result&&result.length>0) {
      callback(false);
    } else {
      links.insert({url:url, title:title, baseUrl:baseUrl, shortenedURL:shortenedURL}, function(err, insert) {
        console.log(insert);
        callback(insert);
      });
    }
  });
};

var findURL = function(shortenedURL, callback) {
  links.find({shortenedURL:shortenedURL}, function(err, result) {
    if (result) {
      callback(result[0].url);
    } else {
      callback(false);
    }
  });
};

var getURLs = function(callback) {
  links.find({}, function(err, result) {
    callback(result);
  });
};


module.exports = {
  storeURLs:storeURLs,
  findURL:findURL,
  getURLs:getURLs
};

// // NOTE: this file is not needed when using MongoDB
// var db = require('../config');

// var Links = new db.Collection();

// Links.model = Link;

// module.exports = Links;


// var db = require('mongo');




// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = {

// };