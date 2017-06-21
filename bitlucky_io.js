var fs = require('fs');
var page = require('webpage').create();     
var datum;
var current_timestamp;

function generateTimestamp(){
    var today = new Date();
    var d= today.getDay();
    var mm= today.getMonth();
    var y = today.getYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var mili = today.getMilliseconds();

    return String(y)+String(mm)+String(d)+String(h)+String(m)+String(s)+String(mili);
}



var casper1 = require('casper').create({
waitTimeout: 120000,
onPageInitialized: function (page) {
        page.evaluate(function () {
            window.screen = {
                width: 1920,
                height: 1080
            };
        });
    },
    viewportSize: {
        width: 1920,
        height: 1080
    }

    });
//casper1.options.waitTimeout = 120000;
//casper1.options.viewportSize: {width: 1920,height: 1080};

var casper2done = false;


/***********************************************************************/
                 /* faucet specific navigation */
/***********************************************************************/

casper1.start("https://bituniverse.net/").then(function(){
    //casper1.capture("casper1_1.png");
   

        this.wait(1000,function(){
            
            console.log("1st wait");
            
            this.evaluate(function() {
                document.querySelector('input[name=address]').value = '1AVNfQQjEJCmst83oQH6RJUpbqkHZWe1W7';
                document.querySelector('.btn-lg').click(); 
            });

            this.capture("bituniverse1"+ generateTimestamp()+".jpg");
        });

        this.wait(5000, function(){

this.captureSelector('C:\\dev\\js_dev\\node\\file22.png', '#adcopy-puzzle-image');

var filedata = fs.read('C:\\dev\\js_dev\\node\\file22.png');
var res = btoa(filedata);
console.log("base: " + res);

/*
            console.log("januvia?: " + januvia);

            if (januvia !=undefined) {
                //go for januvia
                answer ='Januvia';
                console.log("going for Januvia!");
                this.capture("bituniverse1a"+ generateTimestamp()+".jpg");

                this.evaluate(function() {
                document.querySelector('#adcopy_response').value = 'Januvia';
                document.querySelector('.btn-lg').click(); 
                 });

            } else {
                
                 this.captureSelector('C:\\dev\\js_dev\\node\\file22.png', '#adcopy-puzzle-image');
               
            }
*/
        this.capture("bituniverse2"+ generateTimestamp()+".jpg");
//        datum = this.evaluate(function() { 
  //                         return document.querySelector('body').innerHTML;
    //                     });

       // fs.write('dumpu_bituniverse.html', datum, 'w');

       // this.captureSelector('C:\\dev\\js_dev\\node\\file22.png', '#adcopy-puzzle-image');
       


        });

/*
        this.wait(5000,function(){

            this.evaluate(function() {
                document.querySelector('#adcopy_response').value = 'Januvia';
                document.querySelector('.btn-lg').click(); 
            });

            this.capture("bituniverse2"+ generateTimestamp()+".jpg");
        });

     
         this.wait(5000,function(){

            this.evaluate(function() {
                  document.querySelector('.btn-lg').click(); 
            });
            this.capture("bituniverse3"+ generateTimestamp()+".jpg");

        });


        this.wait(5000,function(){

            this.evaluate(function() {
                document.querySelector('#adcopy_response').value = 'Januvia';
                document.querySelector('.btn-lg').click(); 
            });
            this.capture("bituniverse4"+ generateTimestamp()+".jpg");

        });

*/

/***********************************************************************/
    /* 9kw / captcha api part.. probably don't need to change that */
/***********************************************************************/
/*
   casper1.wait(100,function(){ //wait to start second page

        var casper2 = require('casper').create();
          casper2.start("https://www.9kw.eu/grafik/form.html").then(function(){
            console.log("3rd wait inside casper2");
    //run second page
          //  casper1.echo(casper2.getCurrentUrl(), casper2.getTitle());
         //   casper2.capture("casper2.png");

                    console.log("starting solving");
                    var captchaid;
                    console.log("currently on: "+this.getTitle() +" | " + this.getCurrentUrl());
                    var fileName = 'C:/dev/js_dev/node/file22.png';

                            this.fillSelectors('form[action="/index.cgi"]', {
                                    'input[name="apikey"]':'6OSN9CJ6BGXUTAMPJM',
                                    'input[name="file-upload-01"]': 'C:/dev/js_dev/node/file22.png'
                                }, true);
                                
                                console.log("captcha pushed");

                            this.then(function(){

                                this.wait(60000,function(){ //wait for captcha to be solved

                                    console.log("fetching captcha");

                                    captchaid = this.evaluate(function(){

                                            return document.querySelector('body').textContent;

                                        });
                                    
                                    url = 'https://www.9kw.eu/index.cgi?action=usercaptchacorrectdata&apikey=6OSN9CJ6BGXUTAMPJM&id='+captchaid;
                                  
                                    fs.write('C:\\dev\\js_dev\\node\\captchaid.txt',url, 'w');

                                    this.capture("9kw1"+generateTimestamp()+".png");

                                    this.then(function(url){
                                        url = fs.read('C:\\dev\\js_dev\\node\\captchaid.txt');
                                    //  console.log('passed url: '+url);
                                        //casper.open(url).then(function(){
                                        this.open(url).then(function(){   
                                        console.log("currently on: "+ this.getCurrentUrl());
                                           
                                            answer = this.evaluate(function(){

                                                return document.querySelector('body').textContent;

                                            });
                                            
                                            this.capture("asnwer"+generateTimestamp()+".png");
                                            console.log("answer is: "+ answer);
                                            fs.write('C:\\dev\\js_dev\\node\\answer.txt',answer, 'w');

                                          this.capture("9kw1"+generateTimestamp()+".png");

                                          //  fs.remove('C:\\dev\\js_dev\\node\\captchaid.txt')
                                        })


                                    })
                                  });

                           });


        }).run(function(){
            this.echo("DONE 2");
            casper2done = true;
        });

    });

   */

}).waitFor(function check(){
    return casper2done;

}).then(function(){
   //back to the first page
    

/*
    console.log("4th wait");
    console.log("currently on: "+this.getTitle() +" | " + this.getCurrentUrl());
    
    this.capture("answering"+generateTimestamp()+".png");
    
    answer = fs.read('C:\\dev\\js_dev\\node\\answer.txt');
    console.log("answering: "+answer);

    this.evaluate(function(answer){
                //answer = fs.read('C:\\dev\\js_dev\\node\\answer.txt');
                  document.getElementById('adcopy_response').value=answer;
                  document.querySelector("button").click();
    });

    this.capture("answering"+generateTimestamp()+".png");


        this.wait(10000,function(){
            earned = this.evaluate(function(){
                             document.querySelector("h5").textContent;
            });

            this.capture("answering"+generateTimestamp()+".png");
            console.log("earned: "+earned); 

        });

    */

}).run(function(){
    this.echo("DONE");
    this.exit();
});


/* version 1.0 */
/*var casper1 = require('casper').create();
var casper2done = false;

casper1.start("http://www.example.com").then(function(){
    //casper1.capture("casper1_1.png");
   
    var casper2 = require('casper').create();
      casper2.start("http://stackoverflow.com/contact").then(function(){
  
//run second page
        casper1.echo(casper2.getCurrentUrl(), casper2.getTitle());
        casper2.capture("casper2.png");
   
    }).run(function(){
        this.echo("DONE 2");
        casper2done = true;
    });

}).waitFor(function check(){
    return casper2done;

}).then(function(){
   //back to the first page
    casper1.echo(casper1.getCurrentUrl(), casper1.getTitle()); // Comment to fix answer (min 6 chars)
    casper1.capture("casper1_2.png");


}).run(function(){
    this.echo("DONE");
    this.exit();
});
*/


/* varsion 2.0 with waits*/
/*

var casper1 = require('casper').create();
var casper2done = false;

casper1.start("http://www.example.com").then(function(){
    //casper1.capture("casper1_1.png");
   

   casper1.wait(5000,function(){
    console.log("first wait");
   });

casper1.wait(5000,function(){
    console.log("second wait");
   });

   casper1.wait(100,function(){

        var casper2 = require('casper').create();
          casper2.start("http://stackoverflow.com/contact").then(function(){
      
    //run second page
            casper1.echo(casper2.getCurrentUrl(), casper2.getTitle());
         //   casper2.capture("casper2.png");
            console.log("third wait inside casper2");

        }).run(function(){
            this.echo("DONE 2");
            casper2done = true;
        });

    });

}).waitFor(function check(){
    return casper2done;

}).then(function(){
   //back to the first page
    casper1.echo(casper1.getCurrentUrl(), casper1.getTitle()); // Comment to fix answer (min 6 chars)
   // casper1.capture("casper1_2.png");
    console.log("fourth wait back in casper1");

}).run(function(){
    this.echo("DONE");
    this.exit();
});
*/