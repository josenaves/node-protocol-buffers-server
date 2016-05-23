var uuid = require('node-uuid');
var fs = require('fs');

var ProtoBuf = require('protobufjs');
var builder = ProtoBuf.loadProtoFile("./image.proto");

var express = require('express');
var app = express();

var imagesServed = 0;

app.get('/package', function (req, res) {
  
  var buffer = buildRandomMessage();
  res.header('Content-Type', 'application/x-protobuf');
  res.send(new Buffer(buffer, 'binary'));

  console.log(++imagesServed + ' images served');
});

app.listen(9090, function() {
  console.log('Server up. Listening on port 9090...');
});

function buildRandomMessage() {	

  var Image = builder.build('com.josenaves.android.pb.restful.Image');
  var id = uuid.v1();
  var datetime = new Date().toISOString()
  	.replace(/T/, ' ')      // replace T with a space
  	.replace(/\..+/, '');

  var randomImg = randomImage();
  var name = randomImg.name;
  var image = new Image(id, name, datetime, randomImg.data);
  
  var pb = image.encode();
  return pb.toArrayBuffer();
}

function randomImage() {
  var images = ['florianopolis.jpg', 'io2016.jpg', 'google-io16.png'];
  var idx = Math.floor(Math.random() * images.length);
  console.log('Random image is ' + images[idx]);
  return { name: images[idx], data: fs.readFileSync(images[idx]) };
}