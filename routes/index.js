var express = require('express');
var router = express.Router();
var request = require('sync-request');

var errorBool = false;
var errorText;

/* GET home page. */
router.get('/', function(req, res, next) {
  if(typeof req.session.cityList == 'undefined') {
    req.session.cityList = [];
  }

  res.render('weather', { title: 'Page météo', cityList: req.session.cityList, errorBool, errorText });
});



router.get('/add-city', function(req, res, next) {
  errorBool = false;
  if(typeof req.session.cityList == 'undefined') {
    req.session.cityList = [];
  }

  cityList = req.session.cityList;

  var alreadyExist = false;

  for(i=0;i<cityList.length;i++) {
    if(req.query.city.toLowerCase() == req.session.cityList[i].name.toLowerCase()) {
    alreadyExist = true;
    errorBool = true;
    errorText = 'Cette ville est déjà dans la liste !';
    }
  }

  if(alreadyExist == false){

    try {
      var api = request("GET", "http://api.openweathermap.org/data/2.5/weather?q="+ req.query.city.toLowerCase() +"&units=metric&lang=fr&id=524901&APPID=ec24226ca5593b46b4dc91aea70c4b3f");

      var apiTable = JSON.parse(api.getBody());

      req.session.cityList.push({
        name: apiTable.name,
        url: apiTable.weather[0].icon,
        weather: apiTable.weather[0].description,
        tempMin: Math.round(apiTable.main.temp_min),
        tempMax: Math.round(apiTable.main.temp_max)
      })
      errorBool = false;
      errorText = null;
    }
    catch(error) {

      console.log(error);

      if(error.statusCode == 404) {

        errorBool = true;

        errorText = "Cette ville n'existe pas"

      } else if(error.statusCode == 500) {

        errorBool = true;

        errorText = "Le serveur ne répond pas"

      }

    }
    
  }
  
  res.redirect('/');
});

router.get('/delete-city', function(req, res, next) {

  if(typeof req.session.cityList == 'undefined') {
    req.session.cityList = [];
  }

  req.session.cityList = req.session.cityList.filter(function( obj ) {
    return obj.name !== req.query.name;
  }); 

  res.redirect('/');

});

module.exports = router;