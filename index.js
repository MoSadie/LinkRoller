var express = require('express');
var app = express();

// Const settings
const baseURL = 'https://linkroller.azurewebsites.net' //'http://localhost:8080'

app.set('views', './views');
app.set('view engine','pug');

app.get('/', function (req, res) {
    res.render('home');
});

app.use(express.urlencoded({extended: false}));

const regex = /[<>"'\\]/g
function strip(str) {
    return str.replace(regex, "");
}

app.post('/', function (req, res) {
    if (req.body.title) {
        var options = {link: baseURL + "/roll?title=" + encodeURIComponent(strip(req.body.title))};
        if (req.body.description) {
            options.link += "&description=" + encodeURIComponent(strip(req.body.description));
        }
        if (req.body.image) {
            options.link += "&image=" + encodeURIComponent(strip(req.body.image));
        }

        res.render('home', options);
    } else {
        res.render('home', {message: 'Missing title, please add a title.'});
    }
});

app.get('/roll', function (req, res) {
    if (req.query.title) {
        res.render('roll', {title: req.query.title, description: req.query.description, image: req.query.image});
    } else {
        res.render('bad-link');
    }
});

app.use(express.static('public'))

if (process.env.NODE_ENV == "production") {
    console.log("starting express server")
    app.listen(process.env.PORT || 80);
} else if (process.env.NODE_ENV == "development") {
    app.listen(8080);
}