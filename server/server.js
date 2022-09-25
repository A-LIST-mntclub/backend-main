const express = require("express");
const mongoose = require("mongoose");
const port = 3000;
const app = express();
const rp = require("request-promise");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

var cheerio = require("cheerio"); // Basically jQuery for node.js

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mangasee = async (url) => {
  var options = {
    uri: url,
    method: "GET",
    json: true,
    transform: function (body) {
      return cheerio.load(body);
    },
  };
  return rp(options)
    .then(function ($) {
      //this is html
      const htm = $.html();

      let url = options.uri; // obtain name of manga
      let name = url.substring(url.lastIndexOf("/") + 1, url.length);
      name = name.replaceAll("-", " ");

      let begImg = htm.indexOf("img-fluid bottom-5"); // obtain image url
      let imgURL = htm.substring(begImg, begImg + 1000);
      imgURL = imgURL.substring(imgURL.indexOf('="') + 2, imgURL.indexOf('">')); // go through html to get img

      // get entire list of chapters
      let newHtml = htm.substring(htm.indexOf("MainFunction"), htm.length);
      newHtml = newHtml.substring(
        newHtml.indexOf("vm.Chapters"),
        newHtml.indexOf("vm.NumSubs")
      );
      newHtml = newHtml.substring(
        newHtml.indexOf("["),
        newHtml.indexOf("]") + 1
      );
      // search for last chapter and return in human numbers
      const chapters = JSON.parse(newHtml);
      var lastCh = parseFloat(chapters[0].Chapter);
      lastCh = lastCh % 100000;
      lastCh /= Math.pow(10, 1);
      var details = {
        name: name,
        Chapter: lastCh,
        date: chapters[0].Date.substring(0, 10),
        url: imgURL,
      };

      return details;
    })
    .catch(function (err) {
      console.log(err);
      // Crawling failed or Cheerio choked...
    });
};

app.post("/", async (req, res) => {
  let mangaList = Object.values(req.body);
  let updatedList = [];
  var manga = new Object();
  for (let i = 0; i < mangaList.length; i++) {
    if (mangaList[i].includes("mangasee123")) {
      manga = await mangasee(mangaList[i]);
    }
    if (Object.keys(manga).length !== 0) {
      // checks if scraper was successful
      console.log(manga);
      updatedList.push(manga);
    } else {
      // if not then return error code 400
      res.status(400);
    }
    console.log(updatedList);
  }
  res.send(updatedList);
});
