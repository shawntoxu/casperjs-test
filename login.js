
//debugger 
var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});
//var casper = require('casper').create();
var links;
var images = [];
var next ;

function getLinks() {
// Scrape the links from top-right nav of the website
    var links = document.querySelectorAll('div#sidebar-nav ul li a span');
    return Array.prototype.map.call(links, function (e) {
        //return e.getAttribute('href')
        return e.innerHTML 
    });
}

// Opens casperjs homepage
casper.start('http://xxxx');

casper.waitUntilVisible("a.anonymous", function() {
    this.echo("Moving over summit button");
    this.evaluate(
     //自动填充账户
	function (){
	 ee = document.getElementById("email"); 
            ee.value='shawn.wang@xxx.cc';
         pass = document.getElementById("password"); 
           pass.value='111111';}

);
   //点击登陆 
   this.echo("Moving over summit button");
    this.mouse.move("a.login");
    this.click("a.login");
    this.echo("Clicked on button ");
    //wait login success
    this.waitUntilVisible(".nav.nav-tabs", function() {
        this.echo("just login success ");
        // hide play button
        //his.hide(".autoplay");
       //取得目标区域数据
       links = this.evaluate(getLinks);

    });
});

//get html title 
casper.then(function () {
this.echo('First Page: ' + this.getTitle());
});

 
next = function() {
    var image;
    image = "chart.png";
    //images.push(image);
    this.echo("Processing image " + currentLink);
    this.captureSelector(image, '#sidebar-nav');
};



/**per.then(function () {
    links = this.evaluate(getLinks);
});**/


//casper.then(next);

casper.run(function () {
    for(var i in links) {
        console.log(links[i]);
    }
    casper.done();
});


//执行next 函数
//casper.then(next);

//casper.run();

