'use strict'

let stringify = require('json-stringify-safe')
let express = require('express')
let fs = require('fs')
let request = require('request')
let cheerio = require('cheerio')


let url = `https://en.wikipedia.org/wiki/California_Historical_Landmarks_in_Alameda_County,_California`

let json = {table: ''}
request(url, (err, response, html)=>{
  if(!err){

    let $ = cheerio.load(html)

    let data = $('table.wikitable').children()
    json.table = data
    // console.log(data);
  }
  // let obj
  var cache = [];

  var obj = JSON.stringify(json, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
  });
  cache = null
  fs.writeFile('data.json', obj, function(err){
    console.log('Successfully written');
  })
});

// })
