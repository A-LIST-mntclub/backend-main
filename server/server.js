const express = require("express");
const mongoose = require("mongoose");
const port = 3000;
const app = express();
const rp = require("request-promise");

var cheerio = require("cheerio"); // Basically jQuery for node.js
var options = {
  uri: "https://mangasee123.com/manga/Myuun-I",
  transform: function (body) {
    return cheerio.load(body);
  },
};

rp(options)
  //$ = cheerio.load(body), of the web page we're requesting
  .then(function ($) {
    //this is html
    const htm = $.html();
    let begImg = htm.indexOf("img-fluid bottom-5");
    let imgURL = htm.substring(begImg, begImg + 1000);
    imgURL = imgURL.substring(imgURL.indexOf('="') + 2, imgURL.indexOf('">')); // go through html to get img
    let newHtml = htm.substring(htm.indexOf("MainFunction"), htm.length);
    newHtml = newHtml.substring(
      newHtml.indexOf("vm.Chapters"),
      newHtml.indexOf("vm.NumSubs")
    );
    newHtml = newHtml.substring(newHtml.indexOf("["), newHtml.indexOf("]") + 1); // search for list of chapters
    const chapters = JSON.parse(newHtml);
    var lastCh = parseFloat(chapters[0].Chapter);
    // if(lastCh % 100000 > 10000){ // will check if the second digit has value (chapters greater than 1000)
    //   lastCh = lastCh % 10000
    //   if(lastCh % 10 != 0){ // checks if latest chapter is half chapter
    //     lastCh /= Math.pow(lastCh, 1) // moves decimal place one to the left
    //   }
    // }
    lastCh = lastCh % 100000;
    lastCh /= Math.pow(10, 1);
    var details = {
      Chapter: lastCh,
      Date: chapters[0].Date.substring(0, 10),
      url: imgURL,
    };
  })
  .catch(function (err) {
    // Crawling failed or Cheerio choked...
  });
