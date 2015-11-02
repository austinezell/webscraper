'use strict'

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
      let tableRow = $('table.wikitable tr.vcard')
      tableRow.each(function(i){
        let wikiLink = $(this).find('td:nth-child(3)>a').attr('href')
        wikiLink = "https://en.wikipedia.org" + wikiLink
        let registryNumber =  parseInt($(this).find('th>small').text());
        let geoLocale = $(this).find('.geo-dms')
        let image;
        let img = $(this).find('td div.center a>img').attr('src')
        if (img){
          image = `https:${img}`
        }
        let latitude, longitude, location;
        if (geoLocale.text()){
          latitude = geoLocale.find('.latitude').text()
          longitude = geoLocale.find('.longitude').text()
        }else {
          let address = $(this).find('.adr>span.label').text()
          let city = $(this).find('td:nth-child(5)').text()
          location = `${address}, ${city}, CA`
        }
        let name = $(this).find('td:nth-child(3)>a').text()
        let obj = {name, link, registryNumber, latitude, longitude, location, image}
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
