var fs = require('fs');
var page = require('webpage').create();     
var datum;
var current_timestamp;

function generateTimestamp(version){


var currentdate = new Date(); 
var datetime =    currentdate.getDate() + "_"
                + (currentdate.getMonth()+1)  + "_" 
                + currentdate.getFullYear() + " | "  
                + currentdate.getHours() + "_"  
                + currentdate.getMinutes() + "_" 
                + currentdate.getSeconds();



var datetimesafe =currentdate.getDate() + ""
                + (currentdate.getMonth()+1)  + "" 
                + currentdate.getFullYear() + ""  
                + currentdate.getHours() + ""  
                + currentdate.getMinutes() + "" 
                + currentdate.getSeconds();


if (version =="short")
{

    return datetime;
}else {


    return datetimesafe
}

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
   
        this.capture("bituniverse_"+ generateTimestamp()+".jpg");

        this.wait(1000,function(){
            
            console.log("Login [" + generateTimestamp("short")  +"]");
            
            this.evaluate(function() {
                document.querySelector('input[name=address]').value = '1AVNfQQjEJCmst83oQH6RJUpbqkHZWe1W7';
                document.querySelector('.btn-lg').click(); 
            });

      // this.capture("bituniverse1"+ generateTimestamp()+".jpg");
        });

        this.wait(5000, function(){
            console.log("Saving Captcha [" + generateTimestamp("short")  +"]");

            this.captureSelector('C:\\dev\\js_dev\\node\\file22.png', '#adcopy-puzzle-image');
      
      

        });


/***********************************************************************/
    /* 9kw / captcha api part.. probably don't need to change that */
/***********************************************************************/

   casper1.wait(100,function(){ //wait to start second page

        var casper2 = require('casper').create();
          casper2.start("https://www.9kw.eu/grafik/form.html").then(function(){

    //run second page
          //  casper1.echo(casper2.getCurrentUrl(), casper2.getTitle());
         //   casper2.capture("casper2.png");


                    var captchaid;
                   // console.log("currently on: "+this.getTitle() +" | " + this.getCurrentUrl());
                    var fileName = 'C:/dev/js_dev/node/file22.png';

                            this.fillSelectors('form[action="/index.cgi"]', {
                                    'input[name="apikey"]':'6OSN9CJ6BGXUTAMPJM',
                                    'input[name="file-upload-01"]': 'C:/dev/js_dev/node/file22.png'
                                }, true);
                                
                    console.log("Captcha Pushed [" + generateTimestamp("short") +"]" );

                            this.then(function(){

                                this.wait(60000,function(){ //wait for captcha to be solved

                                     console.log("Fetching Captcha [" + generateTimestamp("short") +"]" );

                                    captchaid = this.evaluate(function(){

                                            return document.querySelector('body').textContent;

                                        });
                                    
                                    url = 'https://www.9kw.eu/index.cgi?action=usercaptchacorrectdata&apikey=6OSN9CJ6BGXUTAMPJM&id='+captchaid;
                                  
                                    fs.write('C:\\dev\\js_dev\\node\\captchaid.txt',url, 'w');

                                    //this.capture("9kw1"+generateTimestamp()+".png");

                                    this.then(function(url){
                                        url = fs.read('C:\\dev\\js_dev\\node\\captchaid.txt');
                                    //  console.log('passed url: '+url);
                                        //casper.open(url).then(function(){
                                        this.open(url).then(function(){   
                                      //  console.log("currently on: "+ this.getCurrentUrl());
                                           
                                            answer = this.evaluate(function(){

                                                return document.querySelector('body').textContent;

                                            });
                                            
                                          //  this.capture("asnwer"+generateTimestamp()+".png");
                                            console.log("Fetched answer is: "+ answer);
                                            fs.write('C:\\dev\\js_dev\\node\\answer.txt',answer, 'w');

                                         // this.capture("9kw1"+generateTimestamp(short)+".png");

                                            
                                        })


                                    })

                                });

                           });


        }).run(function(){
            console.log("Leaving Solver [" + generateTimestamp("short") +"]" );
           // this.echo("DONE 2");
            casper2done = true;
        });

    });

   

}).waitFor(function check(){
    return casper2done;

}).then(function(){
   //back to the first page
    

        this.wait(100,function(){
    
         console.log("Answer fill-in [" + generateTimestamp("short")  +"]");            
            //this.capture("answering"+generateTimestamp()+".png");
            
            answer = fs.read('C:\\dev\\js_dev\\node\\answer.txt');
           
            if (answer=="") {
                answer = 'januvia';
            }

            console.log("answering: "+answer);


            this.evaluate(function(answer){
                        //answer = fs.read('C:\\dev\\js_dev\\node\\answer.txt');
                          document.getElementById('adcopy_response').value=answer;
                            document.getElementById('button').click();
                          //document.querySelector('.btn-lg').click(); 
            },answer);
         
        });


        this.wait(1000,function(){


            this.capture("answering"+generateTimestamp()+".png");

            this.evaluate(function(){
                             document.querySelector('.btn-lg').click(); 
                          //  document.getElementById('button').click();
            });


        //    fs.remove('captchaid.txt');

        });

        this.wait(1000,function(){

        /*  this.evaluate(function(){
                            document.getElementById('button').click();
            });
            */

            this.capture("answering"+generateTimestamp()+".png");

            fs.remove('captchaid.txt');
            fs.remove('answer.txt');
         //   fs.remove('file22.png');
       //   fs.remove('*.png');

        //    fs.remove('captchaid.txt');

        });

    /*this.capture("answering"+generateTimestamp()+".png");


        this.wait(10000,function(){
            earned = this.evaluate(function(){
                    document.querySelector("h5").textContent;
            });

            this.capture("answering"+generateTimestamp()+".png");
            console.log("earned: "+earned); 

        });

*/


}).run(function(){
   // this.echo("DONE");
    console.log("Operation Done [" + generateTimestamp("short") +"]");
    this.exit();
});

