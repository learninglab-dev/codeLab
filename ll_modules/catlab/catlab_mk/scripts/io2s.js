const parseXml = require('xml2js').parseString;
const fs = require('fs');
const xml = require('xml');
const xml2js = require('xml2js');
const ioRequest = require('../models/io2s');
const Fcpxml = require('../models/fcpxml');
const path = require('path');
const parseXmlString = require('xml2js').parseString;
// require shootprocessor?
// loop through all


function io2s(segmentArray){
      var offset = 0;
      console.log("starting the io2s function");
      console.log(JSON.stringify(segmentArray, null, 4));
      // console.log(JSON.stringify(cameraArray, null, 4));
      var theFcpxml = "<header>";
      segmentArray.forEach((segment)=>{
        console.log("this segment is from " + segment.clipName);
        console.log("now the offset is " + offset);
        console.log("first segment in point is " + segment.inHr + ":" + segment.inMin + ":" + segment.inSec + ":" + segment.inFrame);
        var inTcFcpxml = 1001*((segment.inFrame)+(24*(segment.inSec+(60*(segment.inMin+(60*segment.inHr))))));
        console.log("inTcFcpxml is " + inTcFcpxml);
        var outTcFcpxml = 1001*((segment.outFrame)+(24*(segment.outSec+(60*(segment.outMin+(60*segment.outHr))))));
        console.log("outTcFcpxml is " + outTcFcpxml);
        var camera = segment.camAngle;
        console.log("camera is " + camera);
        var duration = outTcFcpxml - inTcFcpxml;
        console.log("duration is " + duration);
        offset = offset + duration;
        theFcpxml+=("duration: " + duration);
      });
      console.log("the final offset is " + offset);
      var segmentDuration = tc_from_frames((offset/1001)).tc_string;
      console.log("the segment is " + segmentDuration + " long.");
      var postTs = new Date().getTime();
      console.log("the postTs is " + postTs);

      var newIoProject = new ioRequest({fcpxml: theFcpxml, submissionTs: postTs});
      newIoProject.save((err)=> {console.log("saved result:\n" + JSON.stringify(newIoProject, null, 5))});
      Fcpxml.find({}, function(err, fcpxmls){
        console.log("in the find request");
        console.log(JSON.stringify(fcpxmls));
        for (var i = 0; i < fcpxmls.length; i++) {
          console.log("found this xml: " + fcpxmls[i].shootId);
        }
      });




      // theXmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE fcpxml>\n'
      // // var theXml = xml(theJs, {indent:'\t'});
      // // var theXml = xml(theJs)
      // var theXml = builder.buildObject(theJs);
      // console.log(theXml);
    }

function tc_from_frames(frames){
  var the_frames=(frames % 24);
  var seconds = (frames-the_frames)/24;
  var the_seconds=(seconds%60);
  var minutes = (seconds-the_seconds)/60;
  var the_minutes = minutes%60;
  var the_hours = (minutes-the_minutes)/60;
  var theTc_string = ((("00" + the_hours).slice(-2))+(("00" + the_minutes).slice(-2))+(("00" + the_seconds).slice(-2))+(("00" + the_frames).slice(-2)));
  var theTc_colon_string = ((("00" + the_hours).slice(-2))+ ":" + (("00" + the_minutes).slice(-2))+ ":" + (("00" + the_seconds).slice(-2))+ ":" + (("00" + the_frames).slice(-2)));
  return {tc_forFilename: theTc_string, tc_string:theTc_colon_string};
};


module.exports.io2s = io2s;
// module.exports.singleIo2s = singleIo2s;
