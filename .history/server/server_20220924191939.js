const express = require("express");
const mongoose = require("mongoose");
const port = 3000;
const app = express();
const rp = require("request-promise");

var cheerio = require("cheerio"); // Basically jQuery for node.js

app.listen(port, () => {});

const mangasee = (url) => {
  var options = {
    uri: url,
    method: "GET",
    json: true,
    transform: function (body) {
      return cheerio.load(body);
    },
  };
  rp(options)
    //$ = cheerio.load(body), of the web page we're requesting
    .then(function ($) {
      //this is html
      console.log($);
      const htm = $.html();
      let begImg = htm.indexOf("img-fluid bottom-5");
      let imgURL = htm.substring(begImg, begImg + 1000);
      imgURL = imgURL.substring(imgURL.indexOf('="') + 2, imgURL.indexOf('">')); // go through html to get img
      let newHtml = htm.substring(htm.indexOf("MainFunction"), htm.length);
      newHtml = newHtml.substring(
        newHtml.indexOf("vm.Chapters"),
        newHtml.indexOf("vm.NumSubs")
      );
      newHtml = newHtml.substring(
        newHtml.indexOf("["),
        newHtml.indexOf("]") + 1
      ); // search for list of chapters
      const chapters = JSON.parse(newHtml);
      console.log(chapters);
      var lastCh = parseFloat(chapters[0].Chapter);

      lastCh = lastCh % 100000;
      lastCh /= Math.pow(10, 1);
      var details = {
        Chapter: lastCh,
        date: chapters[0].Date.substring(0, 10),
        url: imgURL,
      };
      console.log(details);
      return details;
    })
    .catch(function (err) {
      // Crawling failed or Cheerio choked...
    });
};

app.get("/", async (req, res) => {
  res.send("hello world");
  // let mangaList = req.body
  // let updatedList = []
  // for (let i = 0; i < mangaList; i++){
  //   if(req.body[i].contains("mangasee123")){
  //     var manga = mangasee(req.body[i])
  //   }
  //   updatedList.push(manga)
  // }

  // res.send(updatedList)
});
