var express = require('express'),
    app = express();

var mongo = require('mongoose');
mongo.connect('mongodb://127.0.0.1:27017/todoDataBase');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

var api = require('./api/apiRouters.js');
app.use('/api', api);


app.listen(8001);