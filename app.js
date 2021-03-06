var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    app = express(),
    port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/view"));
app.use(express.static(__dirname + "/public"));

// Connect to Database
var url = process.env.DATABASEURL || "mongodb://localhost/quotesAPI";

MongoClient.connect(url, function(err, db){
    if(err){
        console.log(err);
    } else {
        quotes = db.collection('quotes');
    }      
});

// Index Route
app.get("/", function(req, res){
    res.render("index.html");
});

// Get Random Quotes
app.get("/quotes", function(req, res){
    quoteAmount(req);
    quotes.aggregate([{$sample: {size: amount}}, {$project: {_id: 0}}], function(err, items){
        if(err){
            res.send("Sorry, something went wrong! Error:" + err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            res.send(items);
        }
    });
});

// Get Quotes By Character
app.get("/quotes/character/:character", function(req, res){
    quoteAmount(req);
    quotes.aggregate([
        {$match: {"character": req.params.character}},
        {$sample: {size: amount}},
        {$project: {_id: 0}}
    ], function(err, items){
        if(err){
            res.send("Sorry, something went wrong! Error:" + err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            res.send(items);
        }
    });        
});

// Get Quotes By Timeline
app.get("/quotes/timeline/:timeline", function(req, res){
    quoteAmount(req);
    quotes.aggregate([
        {$match: {"timeline": req.params.timeline}},
        {$sample: {size: amount}},
        {$project: {_id: 0}}
    ], function(err, items){
        if(err){
            res.send("Sorry, something went wrong! Error:" + err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            res.send(items);
        }
    });        
});

// Check Amount Of Quotes
function quoteAmount(req){
    if(req.query.amount){
        return amount = Number(req.query.amount);            
    } else {
        return amount = 1;
    };
};

// Listen To Port
app.listen(port, function(){
    console.log('API server has started. Listening on port ' + port);
});