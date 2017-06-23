var fs = require('fs');
var page = require('webpage').create();     
var datum;
var current_timestamp;


function kwsolver(fileName){ //'C:/dev/js_dev/node/file22.png'


/***********************************************************************/
    /* 9kw / captcha api part.. probably don't need to change that */
/***********************************************************************/

            var captchaid;
            var api_key = '6OSN9CJ6BGXUTAMPJM';
            var formselector = 'form[action="/index.cgi"]';
            var fileName;// = fileName;
                                       
            var casper2 = require('casper').create();
            casper2.start("https://www.9kw.eu/grafik/form.html").then(function(){

                    this.fillSelectors('form[action="/index.cgi"]', {
                        'input[name="apikey"]':api_key,
                            'input[name="file-upload-01"]': fileName
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
                                    this.then(function(url){
                                        url = fs.read('C:\\dev\\js_dev\\node\\captchaid.txt');
                                        this.open(url).then(function(){   
                                      //  console.log("currently on: "+ this.getCurrentUrl());
                                           
                                            answer = this.evaluate(function(){

                                                return document.querySelector('body').textContent;

                                            });
                                            

                                            if (answer=="") {
                                                answer = 'januvia';
                                            }
                                            console.log("Fetched answer is: "+ answer);
                                            fs.write('C:\\dev\\js_dev\\node\\answer.txt',answer, 'w');  
                                        })
                                    })

                                });

                           });
            

        }).run(function(){
            console.log("Leaving Solver [" + generateTimestamp("short") +"]" );
           // this.echo("DONE 2");
            casper2done = true;
        });

}


function generateTimestamp(version){

var currentdate = new Date(); 
var datetime =    currentdate.getDate() + "_"
                + (currentdate.getMonth()+1)  + "_" 
                + currentdate.getFullYear() + " | "  
                + currentdate.getHours() + "_"  
                + currentdate.getMinutes() + "_" 
                + currentdate.getSeconds();



var datetimesafe =currentdate.getFullYear() + "" 
                + (currentdate.getMonth()+1)  + "" 
                + currentdate.getDate() + ""
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
 //verbose: true,
 //  logLevel: "debug",
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

var casper2done = false;


/***********************************************************************/
                 /* faucet specific navigation */
/***********************************************************************/

casper1.start("https://bituniverse.net/faucet").then(function(){
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



       this.wait(100,function(){ //wait to start second page

        kwsolver('C:/dev/js_dev/node/file22.png');
     
        });

   

}).waitFor(function check(){
    return casper2done;

}).then(function(){
   //back to the first page
    
        casper2done = false;

        this.wait(100,function(){
    
         console.log("Answer fill-in [" + generateTimestamp("short")  +"]");            
            //this.capture("answering"+generateTimestamp()+".png");
            
            answer = fs.read('C:\\dev\\js_dev\\node\\answer.txt');
          

            console.log("answering: "+answer);


            this.evaluate(function(answer){
                        //answer = fs.read('C:\\dev\\js_dev\\node\\answer.txt');
                          document.getElementById('adcopy_response').value=answer;
                            document.getElementById('button').click();
                //this.sendKeys('form#peopleSearchForm input[name=f_CC][type=text]', casper.page.event.key.Enter, {keepFocus: true});
                //this.sendKeys('button', casper.page.event.key.Enter, {keepFocus: true});

                          //document.querySelector('.btn-lg').click(); 
            },answer);

         
        });


/*
        this.wait(100,function(){
            click button
            click btn-lg
        });
*/


}).then(function(){

    console.log("aa");

}).run(function(){
   // this.echo("DONE");
    console.log("Operation Done [" + generateTimestamp("short") +"]");
    this.exit();
});

