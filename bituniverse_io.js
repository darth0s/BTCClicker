var fs = require('fs');
var page = require('webpage').create();     
var datum;
var current_timestamp;
var current_balance;

var apikey = '6OSN9CJ6BGXUTAMPJM';

function kwsolver(fileName,apikey){
/***********************************************************************/
    /* 9kw / captcha api part.. probably don't need to change that */
/***********************************************************************/

        var casper2 = require('casper').create({
            waitTimeout: 120000,
            headers: {
                    'Accept-Language': 'en'
                },
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
          casper2.start("https://www.9kw.eu/grafik/form.html").then(function(){

                    var captchaid;                  
                    //var apikey = '6OSN9CJ6BGXUTAMPJM';
                      
                            this.fillSelectors('form[action="/index.cgi"]', {
                                    'input[name="apikey"]':apikey,
                                    'input[name="file-upload-01"]': fileName
                                }, true);
                                
                            console.log("Captcha Pushed [" + generateTimestamp("short") +"]" );

                            this.then(function(){

                                this.wait(80000,function(){ //wait for captcha to be solved

                                     console.log("Fetching Captcha [" + generateTimestamp("short") +"]" );

                                    captchaid = this.evaluate(function(){

                                            return document.querySelector('body').textContent;

                                        });
                                    
                                    url = 'https://www.9kw.eu/index.cgi?action=usercaptchacorrectdata&apikey=6OSN9CJ6BGXUTAMPJM&id='+captchaid;
                                  
                                    fs.write('captchaid.txt',url, 'w');

                                    //this.capture("9kw1"+generateTimestamp()+".png");

                                    this.then(function(url){
                                        url = fs.read('captchaid.txt');
                                      console.log('passed url: '+url);
                                        //casper.open(url).then(function(){
                                        this.open(url).then(function(){   
                                      //  console.log("currently on: "+ this.getCurrentUrl());
                                           
                                            answer = this.evaluate(function(){

                                                return document.querySelector('body').textContent;

                                            });
                                            

                                            if (answer=="") {
                                                answer = 'januvia';
                                            }

                                          //  this.capture("asnwer"+generateTimestamp()+".png");
                                            console.log("Fetched answer is: "+ answer);
                                            fs.write('answer.txt',answer, 'w');

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

}


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
headers: {
        'Accept-Language': 'en'
    },
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
            /* faucet specific navigation starts here */
/***********************************************************************/

casper1.start("https://bituniverse.net/").then(function(){

//cleanup previously generated screenshots

        this.wait(100,function(){

            var path = ""; // needs trailing slash
            var list = fs.list(path);

            for(var x = 0; x < list.length; x++){
                var file = path + list[x];
                if(fs.isFile(file) && file.match(".png$")){
                    fs.remove(file);
                    console.log("Deleted " + file);
                }
            }

        });

/***********************************************************************/
                              /* login */
/***********************************************************************/
   
        this.wait(1000,function(){
            
            console.log("Login [" + generateTimestamp("short")  +"]");
            
            this.evaluate(function() {
                document.querySelector('input[name=address]').value = '1AVNfQQjEJCmst83oQH6RJUpbqkHZWe1W7';
                document.querySelector('.btn-lg').click(); 
                //document.getElementById('button').click();

            });

      // this.capture("bituniverse"+ generateTimestamp()+".png");
        });

        this.wait(5000, function(){
            console.log("Saving Captcha [" + generateTimestamp("short")  +"]");
            this.captureSelector('file22.png', '#adcopy-puzzle-image');

        });


       casper1.wait(100,function(){ //wait to start second page

            kwsolver('file22.png',apikey);

        });


}).waitFor(function check(){ //wait for kswolver to finish
    return casper2done;

}).then(function(){
   //back to the first page
    
        this.wait(100,function(){


            console.log("Login Answer fill-in [" + generateTimestamp("short")  +"]");            
          
            this.capture("loging "+generateTimestamp()+".png");
            
            answer = fs.read('answer.txt');

            console.log("answering: "+answer);

            this.evaluate(function(answer){
                        document.getElementById('adcopy_response').value=answer;
                        document.getElementById('button').click();
            },answer);
         
        });


        this.wait(1000,function(){

            this.capture("loging "+generateTimestamp()+".png");

            fs.remove('captchaid.txt');
            fs.remove('answer.txt');
            casper2done = false;

        });

}).then(function(){

/***********************************************************************/
                              /* claiming */
/***********************************************************************/

    this.wait(100,function(){

            this.evaluate(function() {
            
                document.getElementById('button').click(); 
            });


    });

    this.wait(1000,function(){

            this.evaluate(function() {
        
              document.querySelector('.btn-lg').click(); 
            });


    });

    this.wait(5000, function(){
            this.capture("claiming "+generateTimestamp()+".png");
            
            console.log("Saving Captcha [" + generateTimestamp("short")  +"]");
            this.captureSelector('file23.png', '#adcopy-puzzle-image');
      
      

        });

   casper1.wait(100,function(){ //wait to start second page

            kwsolver('file23.png',apikey);

        });


}).waitFor(function check(){ //wait for kswolver to finish
    return casper2done;
   
}).then(function(){

     this.wait(100,function(){
    
        this.capture("claiming "+generateTimestamp()+".png");

            console.log("Answer fill-in [" + generateTimestamp("short")  +"]");            
            //this.capture("answering"+generateTimestamp()+".png");
            
            answer = fs.read('answer.txt');
           
            if (answer=="") {
                answer = 'januvia';
            }

            console.log("answering: "+answer);


            this.evaluate(function(answer){
                          document.getElementById('adcopy_response').value=answer;
                            document.getElementById('button').click();
            },answer);
         
        });


     this.wait(1000,function(){

        claimed = this.evaluate(function(){

                
                return document.querySelector('span[data-notify="message"]').textContent.match(/\d+/)[0];
            

        });
        console.log ("claimed: "+ claimed);
        
        fs.remove('captchaid.txt');
        fs.remove('answer.txt');
        casper2done = false;


     });


}).run(function(){

    this.capture("operationDone "+generateTimestamp()+".png");
    console.log("Operation Done [" + generateTimestamp("short") +"]");
    this.exit();

});

