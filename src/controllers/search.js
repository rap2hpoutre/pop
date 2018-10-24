const express = require("express");
const router = express.Router();
const { esUrl } = require("../config.js");
const http = require("http");
const aws4 = require("aws4");

router.use("/*/_msearch", (req, res) => {
  var opts = {
    host: esUrl,
    path: req.originalUrl.replace("/search", ""),
    body: req.body,
    method: "POST",
    headers: { "Content-Type": "Application/x-ndjson" }
  };
  console.log(Date.now(), "RECEIVE");
  aws4.sign(opts);
  http
    .request(opts, res1 => {
      console.log(Date.now(), "SEND");
      res1.pipe(res);
    })
    .end(opts.body || "");
});

module.exports = router;
