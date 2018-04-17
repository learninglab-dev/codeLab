var buttonBox = document.querySelector('#the-button-box');
var results = document.querySelector('#result-box');
var userEvents = [];
// temporarily assign currentVideo variables to the default movie
var currentVideoId = '260963404'
var currentVideoTitle = 'Cello Tap'
var currentVideoUrl = 'https://vimeo.com/260963404'
var sendButton = document.querySelector('#sendToServer');
var jsonButton = document.querySelector('#jsonButton');
var nameField = document.querySelector('#name');
var passwordField = document.querySelector('#password');
var videoLinkButtonBox = document.querySelector('#video-button-box');
var playercontainer = document.querySelector('#playercontainer');
var vimeoElement = document.createElement('iframe');
var videoOverlay = document.querySelector('#main-overlay');

var options = {
        id: currentVideoId,
        width: 623,
        loop: true
  };

var player = new Vimeo.Player('playercontainer', options);
  player.setVolume(0);
  player.on('play', function() {
    console.log('played the video!');
    player.getVideoTitle().then(function(title) {
        console.log('title:', title);
        currentVideoTitle = title;
      });

    player.getVideoUrl().then(function(url) {
        console.log('url:', url);
        currentVideoUrl = url;
        // url = the vimeo.com url for the video
      })
        .catch(function(error) {
          switch (error.name) {
              case 'PrivacyError':
                  // the url isn’t available because of the video’s privacy setting
                  break;

              default:
                  // some other error occurred
                  break;
          }
      });
});

videoLinkButtonBox.addEventListener('click', function(e){
  if (e.target.matches (".video-link-button")) {
    console.log("just clicked " + e.target.id);
    currentVideoId = e.target.id;
    console.log("just changed current video to " + currentVideoId);
    player.loadVideo(e.target.id)
      .then(function(id){
        console.log("hope we just played video with id " + id);
        player.getVideoTitle().then(function(title) {
            console.log('title:', title);
            currentVideoTitle = title;
          });
        player.getVideoUrl().then(function(url) {
            console.log('url:', url);
            currentVideoUrl = url;
            // url = the vimeo.com url for the video

          })
            .catch(function(error) {
              switch (error.name) {
                  case 'PrivacyError':
                      // the url isn’t available because of the video’s privacy setting
                      break;

                  default:
                      // some other error occurred
                      break;
              }
          });

        })
      .catch(function(err){
        console.log(err);
        })

  }
  else if (e.target.matches("#submitVideo")) {
    currentVideoId = document.querySelector('#userVideoId').value;
    player.loadVideo(currentVideoId)
      .then()
      .catch();
  }
  else {
    console.log("problem");
  }
})

videoOverlay.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  console.log("x is " + x);
  console.log("y is " + y);
  var trueX = Math.round(3.09*(x - 13));
  var trueY = Math.round(3.09*(350 - (y - 117)));
  if (trueX > 1920) {
    trueX = 1920
  }
  if (trueX <0) {
    trueX = 0
  }
  if (trueY > 1080) {
    trueY = 1080
  }
  if (trueY <0) {
    trueY = 0
  }
  console.log("trueX is " + trueX);
  console.log("trueY is " + trueY);
  var d = new Date();
  var theClockTime = d.getTime();
  player.getCurrentTime()
    .then(function(seconds){
      var videoTime = 1000 * seconds;
      var theOffset = theClockTime-videoTime;
      var newText = ("logged " + e.target.id + " event at " + videoTime + ". x = " + trueX + " and y = " + trueY );
      var newElement = document.createElement('p');
      newElement.innerHTML = newText;
      results.prepend(newElement);
      userEvents.push({
        user: nameField.value,
        note: "",
        videoId: currentVideoId,
        videoUrl: currentVideoUrl,
        videoTitle: currentVideoTitle,
        eventType: e.target.id,
        clockTs: theClockTime,
        videoTs: videoTime,
        xPosition: x,
        yPosition: y,
        trueXPosition: trueX,
        trueYPosition: trueY
      })
    })
  .catch(function(err){
    console.log(err);
    });
});


buttonBox.addEventListener('click', function(e){
  console.log("just clicked " + e.target.id);
    var d = new Date();
    var theClockTime = d.getTime();
    player.getCurrentTime()
      .then(function(seconds){
        var videoTime = 1000 * seconds;
        var theOffset = videoTime-theClockTime;
        console.log("got " + seconds + " for seconds (which we turned into " + videoTime + " for the videoTs), and " + theClockTime + " for clockTs, and thus the offset is " + theOffset);
        console.log(theOffset);
        console.log(theClockTime);
        var newText = ("logged " + e.target.id + " event at " + videoTime);
        var newElement = document.createElement('p');
        newElement.innerHTML = newText;
        results.prepend(newElement);
        userEvents.push({
          user: nameField.value,
          note: "",
          videoId: currentVideoId,
          videoUrl: currentVideoUrl,
          videoTitle: currentVideoTitle,
          eventType: e.target.id,
          clockTs: theClockTime,
          videoTs: videoTime
        })
        switch (e.target.id) {
        case "likeButton":
        case "inButton":
        case "outButton":
        case "logButton":
          console.log("really pushed the" + e.target.id);
          break;
        case "overlayOn":
          videoOverlay.style.zIndex = "9";
          break;
        case "overlayOff":
          videoOverlay.style.zIndex = "1";
          break;
        case "playButton":
          console.log("really pushed the" + e.target.id + ", which means we need to play");
          if (!nameField.value || !passwordField.value) {
              var newText = ("Don't forget to type a name and password.");
              var newElement = document.createElement('p');
              newElement.innerHTML = newText;
              results.appendChild(newElement);
            }
          else {
            player.play();
            player.play().then(function() {
              // the video was played
              console.log("just started video");
              })
              .catch(function(error) {
                switch (error.name) {
                  case 'PasswordError':
                    console.log("password error");
                    // the video is password-protected and the viewer needs to enter the
                    // password first
                    break;
                  case 'PrivacyError':
                    console.log("privacy error");
                    // the video is private
                    break;
                  default:
                    console.log("some other error");
                    // some other error occurred
                    break;
                  }
              });
          }
          break;
        case "pauseButton":
          console.log("really pushed the" + e.target.id + ", which means we need to pause");
          player.pause().then(function() {
              console.log("just paused, one hopes.");
              // the video was paused
              })
            .catch(function(error) {
              switch (error.name) {
                case 'PasswordError':
                  // the video is password-protected and the viewer needs to enter the
                  // password first
                  break;
                case 'PrivacyError':
                  // the video is private
                    break;
                default:
                  // some other error occurred
                  break;
              }
            });
          break;
        default:
          console.log("something weird has happened--none of the six buttons fired");
        }
        })
      .catch(function(err){
        console.log(err);
        });
})

function onPlayerReady(event) {
  console.log("player ready");
}

function onPlayerStateChange(event){
  console.log(event);
}

sendButton.addEventListener("click", function(){
  sendData(userEvents);
});

jsonButton.addEventListener("click", function(){
  results.innerHTML = "<pre class='no-background'>" + (JSON.stringify(userEvents, null, 4)) + "</pre>";
  // workaround to copy json to clipboard.  Remove??
  var tempText = document.createElement("textarea");
  document.body.appendChild(tempText);
  tempText.value = (JSON.stringify(userEvents, null, 4));
  tempText.select();
  document.execCommand("copy");
  document.body.removeChild(tempText);
});

function sendData(data) {
  var dataObject = {name: nameField.value, password: passwordField.value, events: data};
  var XHR = new XMLHttpRequest();
  XHR.addEventListener('load', function(event) {
    console.log("xhr loaded ok");
    location.reload();
  });
  XHR.addEventListener('error', function(event) {
    console.log("xhr failed on load");;
  });
  XHR.open('POST', '/youtube-data', true);
  XHR.setRequestHeader('Content-type','application/json; charset=utf-8');
  XHR.send(JSON.stringify(dataObject));
  // location.reload();
}

function stopVideo() {
  player.stopVideo();
}
