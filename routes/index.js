const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');
const path = require('path');
const videos = require('../data/json/videos.json');
const links_list = require('../data/json/links.json');
var Marker = require('../models/marker.js');
var SlackEvent = require('../models/slack_event.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'codeLab', links: links_list });
});

router.get('/animedemo', function(req, res, next){
  var linksFolder = path.join(__basedir, 'public/_tests/animejs/examples/anime');
  fs.readdir(linksFolder, (err, paths)=>{
    var theLinks = [];
    paths.forEach(path=>{
      theLinks.push(
        {'title': path,
        'url': ('_tests/animejs/examples/anime/' + path)
        }
      )
    })
    res.render('index', { title: 'anime js links', links: theLinks });
  })
})

router.get('/linksdemo', function(req, res, next){
  console.log(JSON.stringify(links_list, null, 4));
  res.render('links_view',  {title: 'Links Page', data: links_list});
})

router.get('/videos', function(req, res, next){
  res.render('videos', {title: 'Video Bookmarks', videoLinks: videos, width: 480, height: 270})
})

router.get('/threejs', function(req, res, next){
  res.sendFile(path.join(__basedir, 'public/thepage/web-projects-2017/atom-ll-workshop/three-tests/index.html'));
})

router.get('/weitzman', function(req, res, next){
  res.redirect('/_pages/specifics/weitzman-clip.html');
})

router.get('/youtube-markers', function(req, res, next){
  res.sendFile(path.join(__basedir,
    'public/_projects/mk/youtube-markers/youtube-markers.html'));
})

router.post('/youtube-data', function(req, res, next){
  console.log("received post request from " + req.body.name);
  console.log(JSON.stringify(req.body));
  var postTs = new Date().getTime();
  console.log("the postTs is " + postTs);
  if (req.body.password==process.env.DEV_PASSWORD) {
    console.log("password match");
  }
  req.body.events.forEach(marker => {
      console.log("creating marker for " + marker.ts);
      var newMarker = new Marker({
        userName : req.body.name,
        note: marker.note,
        videoId: marker.videoId,
        videoUrl: marker.videoUrl,
        videoTitle: marker.videoTitle,
        clockTs : marker.clockTs,
        videoTs : marker.videoTs,
        type : marker.eventType
      })
      console.log(JSON.stringify(newMarker));
      newMarker.save(function(err){
        if (err) { console.log("there was an error"); return next(err); }
      })
  })

  res.redirect('/youtube-markers');

  // var newResult = new CatResult({name: catMechanics[req.body.catId].name
  //   , rating: req.body.points, loadTs: (req.body.loadTs), postTs: postTs});
  // newResult.save((err)=> {console.log("saved result:\n" + JSON.stringify(newResult, null, 5))});
  //
});

router.get('/vimeo-markers', function(req, res, next){
  res.sendFile(path.join(__basedir,
    'public/_projects/mk/vimeo-markers/vimeo-markers.html'));
})

router.get('/cello-tap', function(req, res, next){
  res.sendFile(path.join(__basedir,
    'public/_projects/mk/cello-tap/index.html'));
})

router.post('/vimeo-data', function(req, res, next){
  console.log("received post request from " + req.body.name);
  console.log(JSON.stringify(req.body));
  var postTs = new Date().getTime();
  console.log("the postTs is " + postTs);
  if (req.body.password==process.env.DEV_PASSWORD) {
    console.log("password match");
  }
  req.body.events.forEach(marker => {
      console.log("creating marker for " + marker.ts);
      var newMarker = new Marker({
        userName : req.body.name,
        note: marker.note,
        videoId: marker.videoId,
        videoUrl: marker.videoUrl,
        videoTitle: marker.videoTitle,
        clockTs : marker.clockTs,
        videoTs : marker.videoTs,
        type : marker.eventType
      })
      console.log(JSON.stringify(newMarker));
      newMarker.save(function(err){
        if (err) { console.log("there was an error"); return next(err); }
      })
  })

  res.redirect('/vimeo-markers');

  // var newResult = new CatResult({name: catMechanics[req.body.catId].name
  //   , rating: req.body.points, loadTs: (req.body.loadTs), postTs: postTs});
  // newResult.save((err)=> {console.log("saved result:\n" + JSON.stringify(newResult, null, 5))});
  //
});

router.get('/logger', function(req, res, next){
  res.sendFile(path.join(__basedir,
    'public/_projects/mk/ll-livelogger/livelogger.html'));
})

router.get('/auth', (req, res) =>{
    res.sendFile(__basedir + '/public/_projects/mk/slack/add_to_slack.html')
})

//
// router.get('/auth/redirect', (req, res) =>{
//     var options = {
//         uri: 'https://slack.com/api/oauth.access?code='
//             +req.query.code+
//             '&client_id='+process.env.CLIENT_ID+
//             '&client_secret='+process.env.CLIENT_SECRET+
//             '&redirect_uri='+process.env.REDIRECT_URI,
//         method: 'GET'
//     }
//     request(options, (error, response, body) => {
//         var JSONresponse = JSON.parse(body)
//         if (!JSONresponse.ok){
//             console.log(JSONresponse)
//             res.send("Error encountered: \n"+JSON.stringify(JSONresponse)).status(200).end()
//         }else{
//             console.log(JSONresponse)
//             res.send("Success!")
//         }
//     })
// })

router.get('/slack', function(req, res, next) {
  console.log("nothing here yet");
  res.send("nothing ready for the browser yet");
});

router.post('/slack/events', function(req, res){
  // res.send(req.body.challenge);
  var newSlackEvent = new SlackEvent(req.body);
  newSlackEvent.save(function(err){
    if (err) {console.log("there was an error");
    return next(err)}
    else {
      console.log("saved event to db");
    }
  })
  console.log(JSON.stringify(req.body));
})

router.post('/slack/interactions', function(req, res){
  // var theResponse = JSON.parse(req.body)
  // console.log(JSON.stringify(theResponse));
  console.log(req.body.payload);
  var payload = JSON.parse(req.body.payload);
  var message = {"text": ("received message from " + payload.user.name + ", which was the response " + payload.actions.value), "response_type": "in_channel"}
  res.send(JSON.stringify(payload))
})

router.post('/slack/menuactions', function(req, res){
  console.log(JSON.stringify(req.body));
})

router.get('/slack/app', function(req, res, next){
  res.send('slack app will go here')
});

router.get('/gifs', function(req, res, next){
  var gifsFolder = path.join(__basedir, 'public/gifs');
  fs.readdir(gifsFolder, (err, paths)=>{
    var theGifs = [];
    paths.forEach(path=>{
      if (path !== ".DS_Store") {
        theGifs.push(
          {'title': path,
          'url': ('/gifs/' + path)
          }
        )
      }

    })
    res.render('gifs', { title: 'the LL gifs', gifs: theGifs });
  })
});

router.post('/llgifs', function(req, res, next){
  if (req.body.token == process.env.SLACK_VERIFICATION_TOKEN) {
    console.log("tokens match, and message is " + req.body.text);
    var message = {
      "text": ("got your message " + req.body.user_name),
      "response_type": "in_channel",
      "attachments": [{
        "text":"this is attachment text",
        "image_url":"http://codelab.learninglab.xyz/gifs/moira_is_unimpressed_with_you_180_15.gif"
      }]}
    res.send(message);
  }
  console.log("received a req from Slack: \n\n++++++++++++++++++\n\n" + JSON.stringify(req.body));
})

router.post('/slack/buttons', (req, res) =>{
    res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body
    var responseURL = reqBody.response_url
    if (reqBody.token != process.env.SLACK_VERIFICATION_TOKEN){
        res.status(403).end("Access forbidden")
    }else{
        var message = {
            "text": "This is your first interactive message",
            "attachments": [
                {
                    "text": "Building buttons is easy right?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "yes",
                            "text": "yes",
                            "type": "button",
                            "value": "yes"
                        },
                        {
                            "name": "no",
                            "text": "no",
                            "type": "button",
                            "value": "no"
                        },
                        {
                            "name": "maybe",
                            "text": "maybe",
                            "type": "button",
                            "value": "maybe",
                            "style": "danger"
                        }
                    ]
                }
            ]
        }
        sendMessageToSlackResponseURL(responseURL, message)
    }
})

function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }
    })
}

module.exports = router;
