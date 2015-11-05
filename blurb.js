'use strict'

let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let newData = [];
let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
data.landmarks = data.landmarks.splice(0, 25)
{
  data = data.landmarks.map( (landmark, i) => {
    let url = landmark.wikiLink
      function getBlurb () {
        request(url, (err, response, html)=>{
        if(!err){
          let $ = cheerio.load(html)
          let blurb = $('#mw-content-text>p').first().text()
          blurb = blurb.replace(/\[\d+\]/g, "")
          landmark.blurb = blurb
          return landmark
        }
      })
    }
    return getBlurb()
  })
}
fs.writeFile('blurbs.json', JSON.stringify(data), function(err){
  console.log('hit');
})
