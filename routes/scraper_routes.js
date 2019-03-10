//Initialize Express
let express = require("express");
let mongoose = require("mongoose");
let router = express.Router();

let db = require("../models");
let scraper = require("../controllers/scraper_controller");

//Init Mongod url
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Create all our routes and set up logic within those routes where required.
router.get("/", async (req, res) => {
  //Get the parsed articles from the scraper
  let articles = await scraper();

  //Upsert each article into the database
  articles.forEach(article => {
    if (article.link && article.imageLink) {
      console.log(article);
      var query = { link: article.link };
      db.Article.findOneAndUpdate(query, article, { upsert: true }).catch(
        ex => {
          console.log(ex);
        }
      );
    }
  });

  //Query the database for all articles and render them in handlebars
  db.Article.find({})
    .populate("notes")
    .then(function(data) {
      var hbsObject = {
        articles: data
      };
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Route to save notes
router.post("/api/note", function(req, res) {
  console.log(req.body);

  //Create a note
  db.Note.create({
    title: req.body.title,
    body: req.body.body
  }).then(dbNote => {
    console.log("~~~Note Id: " + dbNote._id);

    //Add the note to the parent article
    db.Article.findOneAndUpdate(
      { _id: req.body.articleId },
      { $push: { notes: dbNote._id } },
      {
        upsert: true
      }
    )
      .then(updatedDBArticle => {
        res.json(updatedDBArticle);
      })
      .catch(ex => {
        console.log(ex);
      });
  });
});

module.exports = router;
