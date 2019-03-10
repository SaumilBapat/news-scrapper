let axios = require("axios");
let cheerio = require("cheerio");

let scraper = async () => {
  //Initialize Article List
  let articleList = [];

  //New York Times Domain
  const New_York_Times_Domain = "https://www.nytimes.com";

  //Scrape Logic
  let articles = await axios
    .get(New_York_Times_Domain)
    .then(function(response) {
      var $ = cheerio.load(response.data);
      $("article").each(function(i, element) {
        var articleDetails = {};
        articleDetails.link =
          New_York_Times_Domain +
          $(element)
            .find("a")
            .attr("href");
        articleDetails.title = $(element)
          .find("a div h2 span")
          .first()
          .text();
        articleDetails.summary = $(element)
          .find("ul")
          .html();
        articleDetails.imageLink = $(element)
          .find("img")
          .attr("src");
        articleList.push(articleDetails);
      });
      return articleList;
    });

  //Return list of articles
  return articles;
};

module.exports = scraper;
