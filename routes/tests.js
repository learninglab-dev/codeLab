const express = require('express');
const router = express.Router();
const request = require('request');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const videos = require('../data/json/videos.json');
const mk_links_list = require('../data/json/mk_links.json');
var Marker = require('../models/marker.js');
var User = require('../models/user.js');
var SlackEvent = require('../models/slack_event.js');

// const {OAuth2Client} = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'test codeLab links', links: mk_links_list });
});

router.get('/getrequest/:requestdata', function(req, res, next){
  console.log("got your request " + req.params.requestdata );
  var val1 = "A1";
  var val2 = "F10";
  var theUrl = ("https://sheets.googleapis.com/v4/spreadsheets/"
    + process.env.SAMPLE_GOOGLE_SHEET_ID + "/values/"
    + val1 + ":" + val2 + "?key="
    + process.env.GOOGLE_API_KEY);
  console.log(theUrl);
  request(theUrl, function(err, res2, body) {
    console.log(body);
    console.log();
    var theResult = JSON.parse(body)
    res.send(body);
    // res.send(theResult.values[0]);
  });
})

module.exports = router;
