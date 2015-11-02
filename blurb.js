'use strict'

let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
// let index = 0;


let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
let writeFile = () =>{
  fs.writeFile('blurbs.json', JSON.stringify(data), function(err){
    console.log('hit');
  })
}


data.landmarks.forEach(function(landmark) {
  request(landmark.link, (err, response, html)=>{
    if(!err){
      let $ = cheerio.load(html)
      let blurb = $('#mw-content-text>p').first().text()
      blurb = blurb.replace(/\[\w\]/g, "")
      landmark.blurb = blurb ? blurb : ""
    }
  })
  fs.appendFile('blurbs.json', JSON.stringify(landmark), function(err){
    console.log('hit');
  })


  // index++
  // if (index === data.landmarks.length) writeFile()
})
