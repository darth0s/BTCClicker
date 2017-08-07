
var casper = require('casper').create({ 
	pageSettings: { webSecurityEnabled: false },

	verbose: true,
  userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36',
  logLevel: "debug"

});


casper.start('https://claimbtc.com/claim', function() {
 	 	
		console.log("currently on: "+this.echo(this.getTitle()) +" | " + this.getCurrentUrl());

		casper.evaluate(function(username) {
		    document.querySelector('#authViaValue').value = username;
		    document.querySelector('#BtnClaim').click(); //captchaantwort
		}, 'coinminer44@gmail.com');


		casper.wait(50,function(){
			this.click('#claim_btn');
		})

		casper.wait(100,function(){

			this.evaluate(function() {
			    $('#captcha_type').val('solvemedia').change();
		 	})
		
		});
 
		casper.wait(5000,function(){ //alter wait time here if the saved images are not displayed properly

		})
});

//saving captcha
casper.then(function(){
		var page = require('webpage').create();
		var fs = require('fs');
		var datum;
		//var img;

		console.log("currently on: "+this.echo(this.getTitle()) +" | " + this.getCurrentUrl());

		this.capture("captcha_screen.jpg");

		datum = this.evaluate(function() { 
		 					return document.querySelector('body').innerHTML;
		   				 });

		fs.write('dumpu.html', datum, 'w');

 		this.captureSelector('file22.png', '#adcopy-puzzle-image');

});




casper.run();
