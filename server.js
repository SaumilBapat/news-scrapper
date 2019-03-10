//Import Modules
let express = require("express");
var exphbs = require("express-handlebars");
let logger = require("morgan");

//INIT Port
var PORT = process.env.PORT || 3000;

//Initialize express app
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

//Parse Application Body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(logger("dev"));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Import routes from the controller
var router = require("./routes/scraper_routes.js");
app.use(router);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
