const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');
const path = require('path');
const videos = require('../data/json/videos.json');
const mk_links_list = require('../data/json/mk_links.json');
const timelineData = require('../data/json/timeline.json');
var Marker = require('../models/marker.js');
var User = require('../models/user.js');
var SlackEvent = require('../models/slack_event.js');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'mk codeLab links', links: mk_links_list });
});

router.get('/cellotap', function(req, res, next) {
  res.sendFile(path.join(__basedir, '/public/_projects/cello-tap/index.html'));
})

router.get('/cello-tap', function(req, res, next) {
  res.sendFile(path.join(__basedir, '/public/_projects/cello-tap/index.html'));
})

router.get('/threejs', function(req, res, next){
  res.sendFile(path.join(__basedir, 'public/thepage/web-projects-2017/atom-ll-workshop/three-tests/index.html'));
})

router.post('/tokensignin', function(req, res, next) {
  console.log(JSON.stringify(req.body, null, 4));
  client.verifyIdToken({idToken: req.body.idtoken, audience: process.env.GOOGLE_CLIENT_ID}, function(err, data){
    if (err) {
      console.log(err);
    }
    else {
      User.count({sub: data.payload.sub}, function (err, count){
        if(count>0){
        console.log("User Exists");
        }
        else {
          var newUser = new User({
            sub: data.payload.sub,
            given_name: data.payload.given_name,
            family_name: data.payload.family_name,
            hd: data.payload.hd,
            email: data.payload.email
          });
          console.log("just created new user");
          newUser.save(function(err){
              if (err) { console.log("there was an error"); return next(err); }
              else {
                console.log("saved user");
              }
          });
        }
      });
      console.log(JSON.stringify(data, null, 4));
    }
  });


});

router.get('/timeline-convert', function(req, res, next) {
  res.render('pretty-timeline-data', {title: "Pretty Timeline Data", data: timelineData});
})

module.exports = router;
