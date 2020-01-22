var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
  }
mongoose.connect('mongodb+srv://admin:1200137750@cluster0-7vtnx.mongodb.net/weatherapp?retryWrites=true&w=majority', 
    options,         
    function(err) {
    console.log(err);
    }
);