var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// set views location
app.set('views', __dirname+'/client');

// uncomment after placing your favicon in /public
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//static files
app.use('/client', express.static('client'));

//set home page
app.get('/', function (req, res) {
    res.render('index');
});

//set home page
app.get('/m', function (req, res) {
    res.render('mobile');
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    //res.render('error', {
    //    message: err.message,
    //    error: {}
    //});
});

var config ={port:9005};
var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, config.port);
});

module.exports = app;
