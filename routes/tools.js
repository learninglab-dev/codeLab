const express = require('express');
const router = express.Router();
const fs = require('fs');
const request = require('request');
const path = require('path');
const { WebClient } = require('@slack/client');
const token = process.env.XSLACK_TOKEN;
const web = new WebClient(token);
const reactionLogChannel = 'CBAST7RGF';
const timelineData = require('../data/json/timeline.json');

// var Marker = require('../models/marker.js');
// var Io2sRequest = require('../models/io2s_request.js');
// var User = require('../models/user.js');
var SlackEvent = require('../models/slack_event.js');
var toolLinks = [
    {
      "title": "csv converter",
      "url": "/tools/csv"
    },
    {
      "title": "timeline converter",
      "url": "/tools/timeline"
    },
    {
      "title": "pretty-print timeline data",
      "url": "/tools/timeline-convert"
    }
  ];

router.get('/', function(req, res, next) {
    res.render('index', {title: "Tools", links: toolLinks
    });
});

router.get('/', function(req, res, next) {
    res.render('tool', {title: "CSV Converter", instructions: "coming", links:toolLinks});
});

router.get('/timeline-printer', function(req, res, next) {
    res.render('tool', {title: "Timeline Converter", instructions:"coming", links:toolLinks});
});

router.get('/timeline-convert', function(req, res, next) {
  res.render('pretty-timeline-data', {title: "Pretty Timeline Data", data: timelineData});
})

router.post('/slackinteraction', function(req, res, next) {
  console.log(JSON.stringify(req.body, null, 4));
  res.send("got it");
});

router.post('/slackevents', function(req, res){
  console.log("getting a request:\n" + JSON.stringify(req.body));
  // res.send(req.body.challenge);
  var newSlackEvent = new SlackEvent(req.body);
  newSlackEvent.save(function(err){
    if (err) {console.log("there was an error");
    return next(err)}
    else {
      console.log("saved event to db");
    }
  })
  if (newSlackEvent.event.user !== "UB93JCJL8" && newSlackEvent.event.type == "reaction_added") {
    var logMessage = ("REACTION ADDED TO SLACK! \n User " + newSlackEvent.event.user + " added a :" + newSlackEvent.event.reaction + ": in response to " + newSlackEvent.event.item_user + "'s " + newSlackEvent.event.item.type + ".\n\nIs this right?\n")
    console.log(logMessage);
    web.chat.postMessage({ channel: reactionLogChannel, text: logMessage })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);
  }
  res.sendStatus(200);
})

router.post('/timeline-machine/post', function(req, res, next){
  var url = "https://codelab.learninglab.xyz/tools/timeline-machine/sheet/"+ req.body.text +"/range/A1:W100?options=false";
  console.log(JSON.stringify(req.body, null, 4));
  res.send('got it, and here is your URL: ' + url);
});

router.get('/timeline-machine/sheet/:theSheet/range/:range', function(req, res, next){
  console.log("got your request with req.params = " + JSON.stringify(req.params) + " and req.query = " + (req.query ? JSON.stringify(req.query) : "{}"));
  var theUrl = ("https://sheets.googleapis.com/v4/spreadsheets/"
    + req.params.theSheet + "/values/"
    + req.params.range + "?key="
    + process.env.GOOGLE_API_KEY);
  console.log(theUrl);
  request(theUrl, function(err, res2, body) {
    var theResult = JSON.parse(body);
    var theResultObjects = [];
    var theProps = [];
    for (var i = 0; i < theResult.values[0].length; i++) {
      theProps.push(theResult.values[0][i]);
    }
    for (var i = 1; i < theResult.values.length; i++) {
      var newElement = {id: i};
      for (var j = 0; j < theResult.values[0].length; j++) {
        newElement[theResult.values[0][j]]=theResult.values[i][j];
      }
      theResultObjects.push(newElement)
    }
    console.log(JSON.stringify(theResult, null, 4));
    console.log(JSON.stringify(theResultObjects, null, 4));
    res.render('pretty-timeline-data', {title: "your timeline", props: theProps, data: theResultObjects})
  });
})

module.exports = router;
