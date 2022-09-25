// import { axios } from "axios";
const rp = require("request-promise");

let object = {
  1: "https://mangasee123.com/manga/The-Outcast",
  2: "https://mangasee123.com/manga/Kanojo-Wa-Sore-Wo-Gaman-Dekinai",
  3: "https://mangasee123.com/manga/Shikabane-Gatana",
};
// console.log(list);
// let newList = await axios.get("/", list);
// console.log(newList);

var options = {
  uri: "http://localhost:3000/",
  method: "POST",
  body: object,
  json: true,
};
rp(options)
  .then(function (body) {
    console.log(body);
  })
  .catch(function (err) {
    console.log(err);
  });
