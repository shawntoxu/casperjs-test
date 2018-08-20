
var website='https://www.baidu.com/' ;
var exclusive =  [ "author.baidu.com","from=844b","instagram.com" ]  ;
//test search key 
var searchKW = 'hadoop' ;

//simple search 
var fs = require('fs');

var casper = require('casper').create({
 pageSettings: {
        // 冒充浏览器
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
        loadImages:  false,     // do not load images
        loadPlugins: false     // do not load NPAPI plugins (Flash, Silverlight, ...)
    },
    // 浏览器窗口大小
    viewportSize: {
        width: 320,
        height: 568
    }, 
    logLevel: "info",//日志等级   info, debug 
    verbose: true,    // 记录日志到控制台

});
// wait web load ok
casper.start(website, function() {
   // Wait for the page to be loaded
   // get all html 
   //fs.write("temp.html", this.getHTML(), 'w');
   this.waitForSelector('form[action="/from=844b/s"]');
});

casper.then(function() {
   // search for 'casperjs' from bd form
   console.log("run search  ^^^^,title ="+this.title) ;

   // document.querySelector('input[name="q"]').setAttribute('value', term);
   // document.querySelector('form[name="f"]').submit()
   //document.querySelector('input[class="xxx"]').value = rtCode; 
   this.fill('form[action="/from=844b/s"]', {'word': searchKW }, true);
});

//wait 3s then get capture 
casper.wait(3000,function(){
	this.echo('input is done');
	//this.captureSelector('page.png', 'html');   // no search result 
});

var links = [];
//search result really url 
var realLinks = [] ;

function getLinks() {
    //get all href
    var links = document.querySelectorAll('div.c-container a');  // <h3 class="t c-title-en"><a data-click="" href="" /h3>
    return Array.prototype.map.call(links, function(e) {
          return e.getAttribute('href');
    });
}

function hasExclusive(url){
  for(i in exclusive) {
    if(url.indexOf(exclusive[i]) !== -1 ){
      return false ;
    }
  }
  return true ;
}

function existInArray(url){
  if(realLinks.indexOf(url) === -1) {
      return true ;
  }
  return false ; 
}

casper.then(function() {
    // aggregate results for the 'casperjs' search
    fs.write("temp.html", this.getHTML(), 'w');

    links = this.evaluate(getLinks);

    var filteLinks = [] ; 
    //filte the  repeat data 
    for(index in links ){
      if(filteLinks.indexOf(links[index]) === -1){
        filteLinks.push(links[index]);
      }
    }

    // now search for 'phantomjs' by filling the form again
    for(lk in filteLinks){
         this.echo("==== open " + lk + " link  ====" + filteLinks[lk]);
         this.thenOpen(filteLinks[lk], function (response) {
         //this.echo("========" +response.headers.get('Date'));
         //this.echo("========" +response.headers.get('location'));
        // this.echo("=========="+JSON.stringify(response.headers));
        })
    }

});

// casper.then(function () {
//     //casper.captureSelector('baidu.png', 'html');
// });

// casper.thenOpen(website, function () {
//     casper.captureSelector('baidu.png', 'html');
// });

var utils  = require('utils');

casper.on('page.resource.requested',function(requestData, networkRequest){
//console.log("Request (#" + requestData.id + "):"  + JSON.stringify(requestData) +"n");
  if(     requestData['url'] 
      &&  requestData['url'] !==  website 
      &&  hasExclusive(requestData['url'])
      &&  existInArray(requestData['url'])
      ){
      console.log("===url===" + requestData['url']);
      realLinks.push(requestData['url']);
  }
 // if(redirectURLs.indexOf(requestData.url)!== -1) {
 //  //this is a redirect url
 //   networkRequest.abort();
 // }
});


//var redirectURLs = []  ;
// casper.on("resource.received", function(response){
//  if (response.status === 301 ||  response.status === 302) {//use your status here
//    console.log('Response-stage (#' + response.id + ', stage"' + response.stage + '"): ' + JSON.stringify(response) +"n");
//    redirectURLs.push(response.redirectURL);
//  }
// });

//  dump request info 
// casper.on( 'page.resource.requested', function ( requestData, networkRequest )
// {
// 	utils.dump( requestData.headers );
// });


casper.run(function() {
    // echo results in some pretty fashion
    //for(lk in links){
    //	this.echo(" link = " + links[lk]);
    //}

    //this.echo(links.length + ' links found:');
   //this.echo(' - ' + links.join('\n - ')).exit();

     this.echo(realLinks.length + ' realLinks found:');
     this.echo(' - ' + realLinks.join('\n - ')).exit();
});

