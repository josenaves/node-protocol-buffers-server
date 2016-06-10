var uuid = require('node-uuid');
var fs = require('fs');

var ProtoBuf = require('protobufjs');
var builder = ProtoBuf.loadProtoFile("./image.proto");

var express = require('express');
var app = express();

var execSync = require('child_process').execSync;

var imagesServed = 0;

app.get('/random', function (req, res) {
  var buffer = randomImage();
  res.header('Content-Type', 'application/x-protobuf');
  res.send(new Buffer(buffer, 'binary'));
  console.log(++imagesServed + ' images served');
});

app.get('/florianopolis', function (req, res) {
  var name = 'florianopolis.jpg';
  var imageMini = shrinkImage(name);
  if (!imageMini) {
    console.error('Error in JPEGmini integration!');
    res.status(500).send('Error in JPEGmini integration!');
    return;
  }

  var buffer = encodeImage(imageMini);
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

  var imageMini = shrinkImage(name);
  if (!imageMini) {
    console.error('Error in JPEGmini integration!');
    res.status(500).send('Error in JPEGmini integration!');
    return;
  }

  var data = fs.readFileSync(imageMini);
  var img = new Buffer(data, 'binary').toString('base64');

  var obj = {
    'id' : uuid.v1(),
    'name' : imageMini,
    'datetime' : datetime,
    'image_data' : img
  };

  res.header('Content-Type', 'application/json');
  res.send(obj);

  console.log('GET /base64/florianopolis');
  console.log(++imagesServed + ' images served');
});




app.get('/tree', function (req, res) {
  var name = 'tree.jpg';
  var imageMini = shrinkImage(name);
  if (!imageMini) {
    console.error('Error in JPEGmini integration!');
    res.status(500).send('Error in JPEGmini integration!');
    return;
  }

  var buffer = encodeImage(imageMini);
  var imgBuffer = new Buffer(buffer, 'binary');
  res.header('Content-Type', 'application/x-protobuf');
  res.header('Content-Length', imgBuffer.length);
  res.send(imgBuffer);
  console.log('GET /tree');
  console.log(++imagesServed + ' images served');
});

app.get('/base64/tree', function (req, res) {
  var name = 'tree.jpg';
  var datetime = new Date().toISOString()
    .replace(/T/, ' ')      // replace T with a space
    .replace(/\..+/, '');

  var imageMini = shrinkImage(name);
  if (!imageMini) {
    console.error('Error in JPEGmini integration!');
    res.status(500).send('Error in JPEGmini integration!');
    return;
  }

  var data = fs.readFileSync(imageMini);
  var img = new Buffer(data, 'binary').toString('base64');

  var obj = {
    'id' : uuid.v1(),
    'name' : imageMini,
    'datetime' : datetime,
    'image_data' : img
  };

  res.header('Content-Type', 'application/json');
  res.send(obj);

  console.log('GET /base64/tree');
  console.log(++imagesServed + ' images served');
});


app.listen(9090, function() {
  console.log('Server up. Listening on port 9090...');
});

function randomImage() {
  var images = ['florianopolis.jpg', 'io2016.jpg', 'google-io16.png', 'tree.jpg'];
  var idx = Math.floor(Math.random() * images.length);
  console.log('Random image is ' + images[idx]);
  return encodeImage(images[idx]);
}

function shrinkImage(imageFileName) {
  console.log('imageFileName = ' + imageFileName);
  var imageFileNameMini = imageFileName.replace(/(\.[\w\d_-]+)$/i, '_mini$1');
  console.log('imageFileNameMini = ' + imageFileNameMini);

  // remove file_mini.jpg
  console.log('Removing previously shrinked image...');
  try {
    fs.unlinkSync(imageFileNameMini);  
  } catch (e) {
    console.error('no ' + imageFileNameMini + ' found...' );
  }
  
  console.log('Calling JPEGmini...');

  // integration with JPEGmini
  var ret = execSync('jpegmini -f=' + imageFileName, {stdio:[0,1,2]});
  if (ret) {
    console.error("child processes failed with error code: " + error.code);
    return undefined;
  }

  return imageFileNameMini;
}

function encodeImage(imageFileName) {
  var Image = builder.build('com.josenaves.android.pb.restful.Image');
  var id = uuid.v1();
  var datetime = new Date().toISOString()
    .replace(/T/, ' ')      // replace T with a space
    .replace(/\..+/, '');

  console.log('Will read shrinked image = ' + imageFileName);
  var data = fs.readFileSync(imageFileName);

  if (data) {
    console.log("Encoding image in pb");
    var image = new Image(id, imageFileName, datetime, data);
    var pb = image.encode();
    return pb.toArrayBuffer();
  }

  console.error('No data in buffer');
  return null;
}