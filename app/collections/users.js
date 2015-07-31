// NOTE: this file is not needed when using MongoDB
var monk = require('monk');
var db = monk(process.env.CUSTOMCONNSTR_MONGOLAB_URI||'localhost/db')

var users = db.get('users');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



var createUser = function(username, password, callback){
  users.find({username:username}, function(err, result) {
    if (result === []) {
      callback(false);
    } else {
      var cipher = Promise.promisify(bcrypt.hash);
      return cipher(password, null, null).bind(this)
        .then(function(hash) {
          users.insert({password: hash, username: username});
          callback(true);
        });
    }
  })
}


var comparePassword = function(username, attemptedPassword, callback) {
  users.find({username:username}, function(err,result) {
    if (result && result.length>0) {
      bcrypt.compare(attemptedPassword, result[0].password, function(err, match) {
        callback(match);
      }); 
    } else {
      callback(false);
    }
  })
}

// createUser('Linus', 'gibberish');
// Users.model = User;

// module.exports = Users;


// var db = require('../config');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

module.exports = {
  createUser:createUser,
  comparePassword:comparePassword
};
