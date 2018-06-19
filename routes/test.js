const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');
const path = require('path');
const videos = require('../data/json/videos.json');
const mk_links_list = require('../data/json/mk_links.json');
var Marker = require('../models/marker.js');
var User = require('../models/user.js');
var SlackEvent = require('../models/slack_event.js');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'test codeLab links', links: mk_links_list });
});



module.exports = router;
