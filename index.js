const { ipcRenderer} = require('electron');

const electron = require('electron') ;
const axios = require("axios").default;
const cheerio = require("cheerio");
var fs = require('fs');
var {remote} = require('electron');
var path = require('path');
var appPath = remote.app.getAppPath();
var dizigetirPath = path.join(appPath, '../databases');
var dizigetirbin  = 'shows.json';
var dizibolumbin = 'tracker.json';
const powerSaveBlocker = electron.remote.powerSaveBlocker; 
powerSaveBlocker.start('prevent-display-sleep');
//index
var d3 = require('./d3.min.js');
function fethHtml(url){
  var data  =  axios.get(url);
  return data;
}
d3.select('#olcakmis').on('click', function(){
    console.log("bastinhelal");
    
    
   ipcRenderer.send("changeWindow", "page1");  
  // baslarken();
  //  if(typeof localStorage.getItem('diziinfo') !== null && localStorage.getItem('diziinfo') !== 'undefined' ){
  //   var helada = localStorage.getItem('diziinfo');
  //   document.getElementById('baslarken').innerHTML = localStorage.getItem('diziay')+ ' '+ helada +' İzle'
  
  // }
  // else{
  // document.getElementById('baslarken').innerHTML = localStorage.getItem('diziay')+' İzle'
  // } 
    
    })
    function searchdizi(data){
  
        // alert(url);
        //const html = httpGet('http://'+url);
        //fs.writeFileSync('bolum.html', html);
        //console.log(text);
          //console.log(data.toString());
          document.getElementById('gostergelsin').style.display = 'block';
          document.getElementById('burayayaz').innerHTML = '';
          //var results = JSON.parse(data);
          for(var i = 0; i < data.length; i++) {
            var obj = data[i];
        
            //console.log(obj.link);
            var newRow = d3.select("#burayayaz")
          .append('div')
      
          newRow
          .attr('id','topladiv'+i)
          .classed('uk-grid-small',true)
          .attr('uk-grid','')
          
          var newRow = d3.select("#topladiv"+i)
          .append('a')
      
          newRow
          .attr('kref',obj.dizilinker)
          .attr('id','linker'+i)
          .attr('onclick','testit(this);')
          var newRow = d3.select("#linker"+i)
          .append('div')
      
          newRow
          .attr('id','cerceve'+i)
          .classed('uk-width-1-3',true)
          var newRow = d3.select("#cerceve"+i)
          .append('img')
      
          newRow
          .attr('src',obj.diziresim)
          var newRow = d3.select("#topladiv"+i)
          .append('div')
      
          newRow
          .classed('uk-width-expand',true)
          .attr('id','baslikcerceve'+i)
          var newRow = d3.select("#baslikcerceve"+i)
          .append('a')
      
          newRow
          .attr('kref',obj.dizilinker)
          .attr('id','baslik'+i)
          .attr('onclick','testit(this);')
          d3.select('#baslik'+i).text(obj.diziad)
          
          
        }
      }
      d3.select('#aratgel').on('click', function(){
        const db = require('electron-db');
        let term = document.getElementById('keyworder').value;
       
         db.search('shows', 'diziad', term, (succ, data) => {
           if (succ) {
             
            searchdizi(data);
            
           }
         });
         return false
        
           //const charStr = String.fromCharCode(d3.event.keyCode);
        //   setTimeout(function() {
         
       // }, 3000);
          // console.log(charStr);
          // console.log(document.getElementById('searcher').value)
         
      
        })
      
const inserttodb = async () => {
            const db = require('electron-db');
            var location = dizigetirPath;
            console.log(dizigetirPath);
            if (fs.existsSync(path.join(dizigetirPath,  dizigetirbin))) {
              console.log('veritabani var');
              return false
            } else {
              console.log('does not')
            
           
          db.createTable('shows', location, (succ, msg) => {
            // succ - boolean, tells if the call is successful
            if (succ) {
              console.log(msg)
            } else {
              console.log('An error has occured. ' + msg)
            }
          })
            const archivo = 'https://dizist.co/dizi-izle/tumu/tumu/tumu/';
            const htmlarch = await fethHtml(archivo);
            //alert(html.data)
            //console.log(htmlarch.data);
            const $ = cheerio.load(htmlarch.data);
            var archivenum = $('.navigation_last').attr('href').split('/')[7];
            for (var i=1;i<=archivenum;i++){
              const archivo = 'https://dizist.co/dizi-izle/tumu/tumu/tumu/'+i;
             // console.log(archivo);
            const htmlarch = await fethHtml(archivo);
            //alert(html.data)
            //console.log(htmlarch.data);
            const $ = cheerio.load(htmlarch.data);
            const results = $('article.tv-series-list-box').each(function(a, element) {
              let obj = new Object();
          
             //console.log(i+'sayfa:'+a+'.dizilink:'+$(this).find('h3.tv-series-title.ff-2.pull-left').find('a').attr('href'));
            //  console.log(i+'sayfa:'+a+'.diziresim:https://dizist.co'+$(this).find('figure.tv-series-poster.m-r-2').find('img').attr('src'));
              //console.log(i+'sayfa:'+a+'.diziad:'+$(this).find('h3.tv-series-title.ff-2.pull-left').find('a').text());
          obj.id = i+a;
          obj.diziad = $(this).find('h3.tv-series-title.ff-2.pull-left').find('a').text();
          obj.diziresim = 'https://dizist.co'+$(this).find('figure.tv-series-poster.m-r-2').find('img').attr('src');
          obj.dizilinker = 'https://dizist.co'+$(this).find('h3.tv-series-title.ff-2.pull-left').find('a').attr('href');
           if (db.valid('shows')) {
             db.insertTableContent('shows', obj,  (succ, msg) => {
              // succ - boolean, tells if the call is successful
               console.log("Success: " + succ);
               console.log("Message: " + msg);
             })
           }
            
              
              
              
            });
            
            
            }
          }
          }
inserttodb()
function hatirlasevgili(){
    const db = require('electron-db');
    
        if (fs.existsSync(path.join(dizigetirPath,  dizibolumbin))) {
          db.getAll('tracker', (succ, data) => {
            if(succ){
              console.log("son kaldigin yere gidiyoruz");
              ipcRenderer.send("changeWindow", "page1");
            }
            else {
              
            }
            // succ - boolean, tells if the call is successful
            // data - array of objects that represents the rows.
          })
      }
      else{
        
      };
    
}
hatirlasevgili();