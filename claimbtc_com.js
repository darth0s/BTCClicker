/*
casper.start('https://99bitcoins.com/bitcoin-faucet/', function() {
	console.log("checking");
    this.echo(this.getHTML('.timer')); // => 'Plop'
});
*/


//var casper = require('casper').create();
var casper = require('casper').create({ pageSettings: { webSecurityEnabled: false } });

//open page

casper.start('https://claimbtc.com/claim', function() {
 	 	
 	 	console.log("currently on: "+ this.getCurrentUrl());

 	 		casper.wait(50,function(){
		console.log("wait is done");


 
 		})
});


//insert email and click submit

casper.then(function(){

		this.echo(this.getTitle());
		console.log("currently on: "+ this.getCurrentUrl());

		casper.evaluate(function(username) {
		    document.querySelector('#authViaValue').value = username;
		    document.querySelector('#BtnClaim').click();
		}, 'coinminer44@gmail.com');

console.log("*****************************");


	
	});



casper.then(function(){
		
			
		this.echo(this.getTitle());
		console.log("currently on: "+ this.getCurrentUrl());


		this.click('#claim_btn');
});


//change captcha to solve media
casper.then(function(){

	
 /*this.evaluate(function() {
        document.querySelector('select#captcha_type').selectedIndex = 1; //it is obvious
    });
  
*/

casper.wait(100,function(){
 		})

this.evaluate(function() {
    $('#captcha_type').val('solvemedia').change();
});

casper.wait(5000,function(){
		console.log("wait is done2");

 		})

})


casper.then(function(){
		var page = require('webpage').create();
		var fs = require('fs');
		var datum;
		//var img;

		this.echo(this.getTitle());
		console.log("currently on: "+ this.getCurrentUrl());


		datum = this.evaluate(function() { 
		 					return document.querySelector('body').innerHTML;
		   				 });

		fs.write('C:\\dev\\js_dev\\node\\dumpu.html', datum, 'w');

		console.log("*****************************");
		//console.log(datum);



		var imageBase64 = page.evaluate(function(){

	     	var img = document.querySelector('adcopy-puzzle-image-image'); 
		//	var img =document.getElementById("adcopy-puzzle-image-image").querySelector("iframe").contentWindow.document.querySelector("slog");
	     	console.log("imageu: " + img);

	 	 	var canvas = document.createElement("canvas");
	  		canvas.width =img.width;
	  		canvas.height =img.height;
	  		var ctx = canvas.getContext("2d");
	  		ctx.drawImage(img, 0, 0);      
	  		return canvas.toDataURL ("image/png").split(",")[1];

		})

fs.write("C:\\dev\\js_dev\\node\\file22.png",atob(imageBase64),'wb');


/*

		image = this.evaluate(function() { 
		 		return document.querySelector('adcopy-puzzle-image-image').innerHTML;
		   				 });

		console.log("found image" + image);

		this.download(image, 'C:\\dev\\js_dev\\node\\img.gif');



*/
			//var datas=require('utils').dump(this.getHTML());
			//console.log(datas);

		//fs.write('C:\\dev\\js_dev\\node\\dumpu.txt', require('utils').dump(this.getHTML()), 'w');


		//this.echo(this.evaluate(function() { 
		 //					return document.querySelector('ng-scope').innerHTML;
		   //				 }));

});



casper.run();
