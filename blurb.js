'use strict'

let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let newData = {landmarks: []};
let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
let writeFile = () => {
  fs.writeFile('blurbs.json', JSON.stringify(newData), function(err){
    console.log('hit');
  })
}
data.landmarks.forEach( (landmark, i) => {
  let url = landmark.wikiLink
  request(url, (err, response, html)=>{
    if(!err){
      let $ = cheerio.load(html)
      let blurb = $('#mw-content-text>p').first().text()
      blurb = blurb.replace(/\[\d+\]/g, "")
      landmark.blurb = blurb
      newData.landmarks.push(landmark)
      console.log(newData.landmarks.length, data.landmarks.length);
      if(newData.landmarks.length === data.landmarks.length){
        writeFile()
      }
    }
  })
})
