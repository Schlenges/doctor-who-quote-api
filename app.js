var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    app = express(),
    port = process.env.PORT || 3000;

// Index Route
app.get("/", function(req, res){
    res.send("Hi there!");
});

// Connect to Database
MongoClient.connect("mongodb://localhost/quotesAPI", function(err, db){
    var quotes = db.collection('quotes');

    // Get Random Quotes
    app.get("/quotes", function(req, res){
        // Check For Query Limit
        if(req.query.limit){
            var limit = Number(req.query.limit);
            quotes.aggregate([{$sample: {size: limit}}, {$project: {_id: 0}}], function(err, items){
                res.send(items);
            });
        } else {
            quotes.findOne({"character": "The Doctor"}, function(err, item){
                if(err){
                    res.send("Something is wrong");
                } else{
                    res.send(item);
                }
            });
        }
    });

    // Get Quotes By Character
    app.get("/quotes/:character", function(req, res){
        quotes.find({"character": req.params.character}).toArray(function(err, items){
            if(err){
                res.send("Something is wrong");
            } else{
                res.send(items);
            }
        });
    });

});

// Listen To Port
app.listen(port, function(){
    console.log('API server has started');
});


// Character Filter
/*
if(req.query.character){
    var character = req.query.character;
    quotes.findOne({"character": character}, function(err, item){
        if(err){
            res.send("Something is wrong");
        } else{
            res.send(item);
        }                    
    });
} else{}*/