var uuid = require('node-uuid');
var fs = require('fs');

var ProtoBuf = require('protobufjs');
var builder = ProtoBuf.loadProtoFile("./image.proto");

var express = require('express');
var app = express();

var imagesServed = 0;

app.get('/random', function (req, res) {
  var buffer = randomImage();
  res.header('Content-Type', 'application/x-protobuf');
  res.send(new Buffer(buffer, 'binary'));
  console.log(++imagesServed + ' images served');
});

app.get('/florianopolis', function (req, res) {
  var buffer = encodeImage('florianopolis.jpg');
  var imgBuffer = new Buffer(buffer, 'binary');
  res.header('Content-Type', 'application/x-protobuf');
  res.header('Content-Length', imgBuffer.length);
  res.send(imgBuffer);
  console.log('GET /florianopolis');
  console.log(++imagesServed + ' images served');
});

app.get('/base64/florianopolis', function (req, res) {
  var name = 'florianopolis.jpg';
  var datetime = new Date().toISOString()
  	.replace(/T/, ' ')      // replace T with a space
  	.replace(/\..+/, '');

  var data = fs.readFileSync(name);
  var img = new Buffer(data, 'binary').toString('base64');

  var obj = {
  	'id' : uuid.v1(),
  	'name' : name,
  	'datetime' : datetime,
  	'image_data' : img
  };

  res.header('Content-Type', 'application/json');
  res.send(obj);

  console.log('GET /base64/florianopolis');
  console.log(++imagesServed + ' images served');
});

app.listen(9090, function() {
  console.log('Server up. Listening on port 9090...');
});

function randomImage() {
  var images = ['florianopolis.jpg', 'io2016.jpg', 'google-io16.png'];
  var idx = Math.floor(Math.random() * images.length);
  console.log('Random image is ' + images[idx]);
  return encodeImage(images[idx]);
}

function encodeImage(imageFileName) {	
  var Image = builder.build('com.josenaves.android.pb.restful.Image');
  var id = uuid.v1();
  var datetime = new Date().toISOString()
  	.replace(/T/, ' ')      // replace T with a space
  	.replace(/\..+/, '');

  var data = fs.readFileSync(imageFileName);
  var image = new Image(id, imageFileName, datetime, data);
  var pb = image.encode();
  return pb.toArrayBuffer();
}
