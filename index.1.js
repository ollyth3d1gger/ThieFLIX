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

function fethHtml(url){
    var data  =  axios.get(url);
    return data;
}
const steamUrl =
    localStorage.getItem('dizi');

//index1
 const sezon = async () => {
  
        const html = await fethHtml(steamUrl);
        //alert(html.data)
        const $ = cheerio.load(html.data);
        // return false;      
        // Here we are telling cheerio that the "<a>" collection 
        //is inside a div with id 'search_resultsRows' and 
        //this div is inside other with id 'search_result_container'.
        //So,'searchResults' is an array of cheerio objects with "<a>" elements
        
        const searchResults = $("#main-wrapper > div.content-wrapper.p-t-2 > section.tv-seasons-container.full-width.pull-left.m-y-3 > div.tv-seasons > div > div")
        .find('.fw-bold').each(function(i, element) {
            
            var sezonbaslik = $(this).html();
           // console.log(sezonbaslik);
            var newRow = d3.select("#olanbiten")
    .append('li')

    newRow
    .attr('id','sezonenbuyuk'+i)
    var newRow = d3.select("#sezonenbuyuk"+i)
    .append('a')

    newRow
    .classed('uk-accordion-title',true)
    .attr('href','#')
    .attr('id','hilmi'+i)
    d3.select('#hilmi'+i).text(sezonbaslik);
    var newRow = d3.select("#sezonenbuyuk"+i)
    .append('div')

    newRow
    .classed('uk-accordion-content',true)
    .attr('id','borazan'+i)
    var newRow = d3.select("#borazan"+i)
    .append('ul')

    newRow
    .classed('course-video-list highlight-watched',true)
    .attr('id','sonviraj'+i)
    
    const searchResulty = $('div.tv-seasons-eplists.owl-carousel')
        .find("[data-season=0]").find(".episode-row").find(".table-cell.fw-bold").find("a").each(function(a, element) {
            var bolumcu = $(this).html();
            var filter = d3.select('#hilmi'+i).text();
            var first = filter.split('.').join('. ');
            var second = first.split('n')[0]
           // console.log(second);
        var bolumbasi = bolumcu.replace("B&#xF6;l&#xFC;m","Bölüm");
        if(second === bolumbasi.split('n')[0]){
        //console.log(splitstring[0]);
       // console.log(splitstring[2]);
       
       var linker = $(this).attr('href');
       var newRow = d3.select("#sonviraj"+i)
   .append('li')
   
   newRow
   .classed('watched',true)
   .attr('id','bolum'+a+i)
   
       

   var newRow = d3.select("#bolum"+a+i)
   .append('a')
   
   newRow
   .attr('id',"linker")
   .attr('kref',linker)
   .attr('onclick','testit(this);')
   .text(bolumbasi);
   


 
        }
    
});

        });
        //alert(searchResults);
        // Don't worry about this for now
        //const url = searchResults.attr('src');
        //scrapvidmoly1(url);
        
        
      


      };
      
const scrapSteam = async (steamUrl) => {
  
  const html = await fethHtml(steamUrl);
  
  
  const $ = cheerio.load(html.data);
  
  // Here we are telling cheerio that the "<a>" collection 
  //is inside a div with id 'search_resultsRows' and 
  //this div is inside other with id 'search_result_container'.
  //So,'searchResults' is an array of cheerio objects with "<a>" elements
  const searchResults = $("iframe");

  // Don't worry about this for now
  const url = searchResults.attr('src');
  d3.select('#bolumsrc').attr('src',url);
  console.log(url);
  //scrapvidmoly1(url);
};




var d3 = require('./d3.min.js');
//index1
d3.select('#bolumegec').on('click', function(){
  if(localStorage.getItem('diziinfo') === null || localStorage.getItem('diziinfo') === 'undefined' || localStorage.getItem('diziinfo') === NaN ){
    console.log("tests  ")  
    document.getElementById('baslarken').innerHTML = localStorage.getItem('diziay')+' İzle'  

  }
else{
  console.log("test")
  var helada = localStorage.getItem('diziinfo');
  document.getElementById('baslarken').innerHTML = localStorage.getItem('diziay')+ ' '+ helada +' İzle'
  
}
  
scrapSteam('https://dizist.co'+localStorage.getItem('suanki'));
               
})
//index1
function dizigom(){
  if(localStorage.getItem('diziinfo') !== null && localStorage.getItem('diziinfo') !== 'undefined' && localStorage.getItem('diziinfo') !== NaN ){
    var helada = localStorage.getItem('diziinfo');
    console.log("hela:"+helada);
    document.getElementById('baslarken').innerHTML = localStorage.getItem('diziay')+ ' '+ helada +' İzle'

  }
else{
  document.getElementById('baslarken').innerHTML = localStorage.getItem('diziay')+' İzle'
}
const db = require('electron-db');

      if (fs.existsSync(path.join(dizigetirPath,  dizibolumbin))) {
        db.search('tracker', 'diziad', localStorage.getItem('dizi'), (succ, data) => {
    if (succ) {
      
      if(data.length !== 0){
     
         
        
        scrapSteam(data[0].dizibolum);                        
        return false;
      }else{
        let where = {
          "diziad": localStorage.getItem('dizi')
        };
        let set = {
          "dizibolum": localStorage.getItem('suanki'),
          "diziust": document.getElementById('baslarken').innerHTML
        }
        db.updateRow('tracker', where, set, (succ, msg) => {
          // succ - boolean, tells if the call is successful
          console.log("Success: " + succ);
          console.log("Message: " + msg);
        });
        
        
      }
    }else {
      alert("error:")
    }
  });


  
} 
      else {
          console.log('does not')


          db.createTable('tracker', dizigetirPath, (succ, msg) => {
// succ - boolean, tells if the call is successful
              if (succ) {
  console.log(localStorage.getItem('dizi'));
              } else {
  console.log('An error has occured. ' + msg)
          } 
          })
              let obj = new Object();

              obj.diziust = document.getElementById('baslarken').innerHTML;
              obj.diziad = localStorage.getItem('dizi');
              obj.dizibolum = localStorage.getItem('dizi')+'/1-sezon-1-bolum-izle';

              if (db.valid('tracker')) {
              db.insertTableContent('tracker', obj,  (succ, msg) => {
  // succ - boolean, tells if the call is successful
              console.log("Success: " + succ);
              console.log("Message: " + msg);
                  })
                }
              localStorage.setItem('suanki',localStorage.getItem('dizi')+'/1-sezon-1-bolum-izle');
              scrapSteam(localStorage.getItem('dizi')+'/1-sezon-1-bolum-izle');          
}

}

//index1  
 function baslarken(){
  console.log("baslarken triggered");
    const db = require('electron-db');
    
        if (fs.existsSync(path.join(dizigetirPath,  dizibolumbin))) {
          db.getAll('tracker', (succ, data) => {
            if(succ){
              console.log("success hem");
              localStorage.setItem('dizi',data[0].diziad)
              console.log(data[0].diziad);
              document.getElementById('baslarken').innerHTML = data[0].diziust;
              sezon();   
              dizigom()
            }
            else {
              
            }
            // succ - boolean, tells if the call is successful
            // data - array of objects that represents the rows.
          })
      }
      else{
        sezon();   
        dizigom()
      };
    
    
      
    }   

d3.select('#bilmioke').on('click', function(){
  console.log("bastinhelal")
  localStorage.removeItem('diziinfo')
  localStorage.removeItem('suanki')
  localStorage.removeItem('dizi')
  fs.unlink(path.join(dizigetirPath,dizibolumbin));
  ipcRenderer.send("changeWindow", "page2");
})
function searchdizist(text){
  axios.post('https://dizi-st.com/wp-admin/admin-ajax.php', {
    search_631165: text,
    action: "search_post"
  })
  .then((response) => {
    console.log(response);
  }, (error) => {
    console.log(error);
  });
}
function kaydetdur(){
  
  console.log("mevcut bolum konumu kaydedildi:"+'https://dizist.co'+localStorage.getItem('suanki'));
  const db = require('electron-db');

 
  let where = {
    "diziad": localStorage.getItem('dizi')
  };
  let set = {
    "dizibolum": 'https://dizist.co'+localStorage.getItem('suanki'),
    "diziust":document.getElementById('baslarken').innerHTML
  }            
  db.updateRow('tracker', where, set, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log("Success: " + succ);
    console.log("Messages: " + msg);
  });
  
}
setInterval(kaydetdur,3000);

baslarken();