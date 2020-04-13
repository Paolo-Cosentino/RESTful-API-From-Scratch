const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

///////////////////////////////MongoDB Connection & Setup/////////////////////////
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Artitcle = mongoose.model("Article", articleSchema);


//////////////////////////Request Targetting All Articles//////////////////////
/*
Method of chaining our HTTP requests using app.route()
Syntax:
    app.route("/path").get(callback function).post(call back function).delete(callback function);
*/
app.route("/articles")
    .get(function (req, res) {
        Artitcle.find({}, function (err, articles) {
            if (!err)
                res.send(articles);
            else
                res.send(err);
        });
    })
    .post(function (req, res) {
        const newArticle = new Artitcle({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send("Sucessfully added article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Artitcle.deleteMany({}, function (err) {
            if (!err) {
                res.send("Succesfully deleted all articles.")
            } else {
                res.send(err);
            }
        });
    });


/////////////////////Request Targeting Specific Articles///////////////////////
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        // console.log(title);
        Artitcle.findOne({ title: req.params.articleTitle }, function (err, foundTitle) {
            if (foundTitle)
                res.send(foundTitle);
            else
                res.send("No articles found for: " + requestedTitle);
        });
    })
    .put(function (req, res) {
        Artitcle.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err, result) {
                if (err)
                    res.send(err);
                else
                    res.send("Update Successful");
            }
        );
    })
    .patch(function (req, res) {
        Artitcle.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body }, //dynamic, changes will be made to the fields that the user specifies.
            function (err) {
                if (!err)
                    res.send("Successfully update article");
                else
                    res.send(err);
            }
        );
    })
    .delete(function (req, res) {
        Artitcle.deleteOne({ title: req.params.articleTitle }, function (err) {
            if (!err)
                res.send("Deletion Successfull");
            else
                res.send(err);
        });
    });


//Express Server
app.listen(3000, function () {
    console.log("App is running on Port 3000");
});
