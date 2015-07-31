var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');

var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.getURLs(function(result) {
    res.send(200, result);
  }); 
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  // if (!util.isValidUrl(uri)) {
  //   console.log('Not a valid url: ', uri);
  //   return res.send(404);
  // }

  util.getUrlTitle(uri, function(err, title) {
    if (err) {
      console.log('Error reading URL heading: ', err);
      return res.send(404);
    } else {
      Links.storeURLs(uri, title, req.headers.origin, function(result) {
        res.send(200, result);
      });
    }
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }

  //       var link = new Link({
  //         url: uri,
  //         title: title,
  //         base_url: req.headers.origin
  //       });

  //       link.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log('Attempted login', username, password);
  Users.comparePassword(username, password, function(result) {
    if (result) {
      console.log('createSession');
      util.createSession(req, res, username);
    } else {
      res.redirect('/login');
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  Users.createUser(username, password, function( result) {
    if (result) {
      util.createSession(req, res, username);
    } else {
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};