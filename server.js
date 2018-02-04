var express = require('express');
var app = express();

const tinycolor = require("tinycolor2");

const {data} = require("./js/data.js");

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname));

const color = {
  black: '#222222',
  white: '#ffffff',
  palegrey: '#fafafa',
  lightgrey: '#efefef',
  midgrey:  '#aaaaaa',
  darkgrey: '#333333',
  orange: '#ff9900'
};

// // get list of projects
// const fs = require('fs');
// let projects = [];
// fs.readdirSync('./views/projects').forEach(fileName => {
//   projects.push(fileName.replace('.html.ejs', ''));
// });

// set the view engine to ejs
app.set('view engine', 'ejs');

// default pageData

app.get('/', function(req, res) {
  res.render('../views/index.html.ejs', {
    allData: data,
    color: color,
    tinycolor: tinycolor
  });
});

app.get('/about', function(req, res) {
  res.render('../views/about.html.ejs', {
    allData: data,
    color: color,
    tinycolor: tinycolor
  });
});

// any page that is not the root / homepage

app.get('/*', function(req, res) {
  // if request is homepage
  let pageData = {};
  let reqPage = req.url.replace('/', '');
  console.log('reqpage', reqPage);
  // check if request is a page in the data
  let dataIndex = data.findIndex(p => p.id === reqPage);
  if(typeof dataIndex !== 'undefined'){
    // if the page exists, set up the data
    pageData.current = data.filter(p => p.id === reqPage)[0];
    pageData.previous = dataIndex > 0 ? data[dataIndex - 1] : null;
    pageData.next = dataIndex < (data.length - 1) ? data[dataIndex + 1] : null;
  }

  // render page. An unknown page will trigger express error
  res.render('../views/projects/' + reqPage + '.html.ejs', {
    pageData: pageData,
    allData: data,
    color: color,
    tinycolor: tinycolor
  });
});

// The above will fail with an error status (maybe 404), which will be handled below

// error handler
// app.use(function(err, req, res, next) {
//   // render the error page
//   res.status(err.status || 500);
//   console.log(err.status); // coming up as undefined error... :(
//   res.render('../views/404.html.ejs');
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
