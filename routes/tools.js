const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
// var Marker = require('../models/marker.js');
// var Io2sRequest = require('../models/io2s_request.js');
// var User = require('../models/user.js');
// var SlackEvent = require('../models/slack_event.js');

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.send('index');
// });

router.post('/slackinteraction', function(req, res, next) {
  console.log(JSON.stringify(req.body, null, 4));
  res.send("got it");
});

router.post('/slackevents', function(req, res){
  console.log("getting a request:\n" + JSON.stringify(req.body));
  res.send(req.body.challenge);
  // var newSlackEvent = new SlackEvent(req.body);
  // newSlackEvent.save(function(err){
  //   if (err) {console.log("there was an error");
  //   return next(err)}
  //   else {
  //     console.log("saved event to db");
  //   }
  // })
  // console.log(JSON.stringify(req.body));
})

module.exports = router;
