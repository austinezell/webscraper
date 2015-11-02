'use strict'

let stringify = require('json-stringify-safe')
let express = require('express')
let fs = require('fs')
let request = require('request')
let cheerio = require('cheerio')
let index = 0
let data = JSON.parse(fs.readFileSync('./county.json', 'utf8'));
let json = {landmarks: []}

let writeFile = () =>{
  fs.writeFile('data.json', JSON.stringify(json), function(err){
    console.log('hit');
  })
}

let gatherData = (url) =>{
  request(url, (err, response, html)=>{
    if(!err){
      let $ = cheerio.load(html)
      let tableRow = $('.wikitable .vcard')
      tableRow.each(function(i){
        let geoLocale = $(this).find('.geo-dms')
        let name = $(this).find('td:nth-child(3)').text()
        let location = geoLocale.text() ? geoLocale.text() : $(this).find('td:nth-child(4)').text()
        let obj = {name: name, location: location}
        if (obj.name) json.landmarks.push(obj)
      })
      index++
      if (index === data.counties.length) writeFile()
    }
  });
}


data.counties.forEach( (county) =>{
  let url = `https://en.wikipedia.org/wiki/California_Historical_Landmarks_in_${county}_County,_California`
  gatherData(url)
})
