var fs = require('fs');
var page = require('webpage').create();     
var datum;
var current_timestamp;
var current_balance;
var type;
var start_time;
var claimed;
var bitwallet = '1AVNfQQjEJCmst83oQH6RJUpbqkHZWe1W7';
var apikey = '6OSN9CJ6BGXUTAMPJM'; //9kw
var application = 'bituniverse_withdraw';
var cooldown=60;

function pusher(claimed,type,start_time,end_time){

    claimed=claimed;
    type=type;
    start_time = start_time;
    end_time = end_time;

     casper1.thenOpen("http://meowbi.nazwa.pl/darth0s/btc/mysql_load.php", {
    //append claimed value to stats for reporting
    //add start and end time for script to calculate duration
          method: 'post',
          data:{      
              'value': claimed,
              'portal': application,
              'claim': type,
              'start_time':start_time,
              'end_time':end_time
          }

    },function(){

         this.capture(application+" pusher21 "+generateTimestamp()+".png");
           console.log('pusher pushed: '+claimed+"|"+application+"|"+type+"|"+start_time+"|"+end_time);
    });
    
//    this.capture(application+" pusher2 "+generateTimestamp()+".png");
  
}

/***********************************************************************/
    /* 9kw / captcha api part.. probably don't need to change that */
/***********************************************************************/

function kwsolver(fileName,apikey){

        var casper2 = require('casper').create({
            waitTimeout: 150000,
            headers: {
                    'Accept-Language': 'en'
                },
            onPageInitialized: function (page) {
                    page.evaluate(function () {
                        window.screen = {
                            width: 1440,
                            height: 900
                        };
                    });
                },
                viewportSize: {
                    width: 1440,
                    height: 900
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

                                this.wait(90000,function(){ //wait for captcha to be solved

                                     console.log("Fetching Captcha [" + generateTimestamp("short") +"]" );

                                    captchaid = this.evaluate(function(){

                                            return document.querySelector('body').textContent;

                                        });
                                    
                                    url = 'https://www.9kw.eu/index.cgi?action=usercaptchacorrectdata&prio=1&apikey='+apikey+'&id='+captchaid;
                                  
                                    fs.write(application+'captchaid.txt',url, 'w');

                                    //this.capture("9kw1"+generateTimestamp()+".png");

                                            this.then(function(url){
                                                url = fs.read(application+'captchaid.txt');

                                              console.log('passed url: '+url);
                                                //casper.open(url).then(function(){
                                                    this.open(url).then(function(){   
                                                  //  console.log("currently on: "+ this.getCurrentUrl());
                                                       
                                                        answer = this.evaluate(function(){

                                                            return document.querySelector('body').textContent;

                                                        });

                                                      //  this.capture("asnwer"+generateTimestamp()+".png");
                                                        console.log("Fetched answer is: "+ answer);
                                                        fs.write(application+'answer.txt',answer, 'w');

                                                     // this.capture("9kw1"+generateTimestamp(short)+".png");

                                                        
                                                    });
                                               // .waitForSelectorTextChange('body',function(){
                                                 //   console.log("answer provided");
                                               // }) ;
                                                
                                            }) ;

                                });

                           });


        }).run(function(){

            console.log("Leaving Solver [" + generateTimestamp("short") +"]" );
           // this.echo("DONE 2");
            casper2done = true;

            if (answer=="") {
                pusher(0,"failed to captcha",start_time,generateTimestamp());
                this.capture(application+" kwfailure2 "+generateTimestamp()+".png");
                console.log("failed to captcha. Check captcha id if correct: "+fs.read(application+'captchaid.txt'));
                casper1.exit();
                this.exit();
            }
        
        });

}

function cleaner(mode){
            var path = ""; // needs trailing slash
            var list = fs.list(path);

            for(var x = 0; x < list.length; x++){
                    var file = path + list[x];
                    if(
                        fs.isFile(file) 
                        //&& file.match(".png$") 
                        && file.match("^"+application)
                        && !file.match(".js$")
                    )
                {
                    fs.remove(file);
                  
                    if (mode!="quiet"){
                    console.log("Deleted " + file);
                    }
                }
            }
}

function generateTimestamp(version){


var currentdate = new Date(); 


year = currentdate.getFullYear();

if(currentdate.getMonth()+1<10){month = "0"+(currentdate.getMonth()+1);}else{month = currentdate.getMonth()+1;};
if(currentdate.getDate()<10){day= "0"+currentdate.getDate();}else{ day=currentdate.getDate();};
if(currentdate.getHours()<10){hour= "0"+currentdate.getHours();}else{ hour= currentdate.getHours();};
if(currentdate.getMinutes()<10){ minute= "0"+currentdate.getMinutes();}else{ minute= currentdate.getMinutes();} ;
if(currentdate.getSeconds()<10){second = "0"+currentdate.getSeconds();}else{ second= currentdate.getSeconds();};


var datetime = day +"_" + month +"_" + year + " | " + hour +"_" +minute +"_" +second;
var datetimesafe = year +"" + month +"" + day + "" + hour +"" +minute +"" +second;



var shifteddate = new Date();
shifteddate.setTime(currentdate.getTime()+(cooldown*60*1000));

if(shifteddate.getMonth()+1<10){ monthsafe = "0"+(shifteddate.getMonth()+1);}else{ monthsafe = shifteddate.getMonth()+1;};
if(shifteddate.getDate()<10){ daysafe= "0"+shifteddate.getDate();}else{ daysafe = shifteddate.getDate();};
if(shifteddate.getHours()<10){ hoursafe= "0"+shifteddate.getHours();}else{ hoursafe= shifteddate.getHours();};
if(shifteddate.getMinutes()<10){ minutesafe= "0"+shifteddate.getMinutes();}else{ minutesafe= shifteddate.getMinutes();} ;
if(shifteddate.getSeconds()<10) {secondsafe = "0"+shifteddate.getSeconds();}else{ secondsafe= shifteddate.getSeconds();};


var datetimeshift = daysafe +"_" + monthsafe +"_" + year + " | " + hoursafe +"_" +minutesafe +"_" +secondsafe;

        if (version =="short")
        {

            return datetime;

        }else if(version=="shift") {

            return datetimeshift 

        }else {

            return datetimesafe

        }

} 


/* end of functions */

var casper1 = require('casper').create({
waitTimeout: 150000, 
//clientScripts:["generateTimestamp.js"],
headers: {
        'Accept-Language': 'en'
    },
onPageInitialized: function (page) {
        page.evaluate(function () {
            window.screen = {
                width: 1440,
                height: 900
            };
        });
    },
    viewportSize: {
        width: 1440,
        height: 900
    }

    });

//casper1.options.clientScripts.push('./generateTimestamp.js');
var casper2done = false;
start_time=generateTimestamp();


/***********************************************************************/
            /* faucet specific navigation starts here */
/***********************************************************************/

casper1.start("http://google.com").then(function(){

//cleanup previously generated screenshots

        this.wait(100,function(){

         cleaner();

        });

}).thenOpen("https://bituniverse.net/",function(){

/***********************************************************************/
                              /* login */
/***********************************************************************/
   
        this.wait(1000,function(){
            
            console.log("Login [" + generateTimestamp("short")  +"]");
            
           // console.log(bitwallet);

            this.evaluate(function(bitwallet) {
                document.querySelector('input[name=address]').value = bitwallet;
                document.querySelector('.btn-lg').click(); 
            },bitwallet);

      // this.capture("bituniverse"+ generateTimestamp()+".png");
        });

        this.wait(4000, function(){
            console.log("Saving Captcha [" + generateTimestamp("short")  +"]");
            this.captureSelector(application+'file22.png', '#adcopy-puzzle-image');

        });


       casper1.wait(100,function(){ //wait to start second page

            kwsolver(application+'file22.png',apikey);

        });


}).waitFor(function check(){ //wait for kswolver to finish
    return casper2done;

}).then(function(){
   //back to the first page
    
        this.wait(100,function(){


            console.log("Login Answer fill-in [" + generateTimestamp("short")  +"]");            
          
            this.capture(application+" loging "+generateTimestamp()+".png");
            
            answer = fs.read(application+'answer.txt');

            console.log("answering: "+answer);

            this.evaluate(function(answer){
                document.getElementById('adcopy_response').value=answer;
                document.getElementById('button').click();
            },answer);
         
        });


        this.wait(500,function(){

            this.capture(application+" loging "+generateTimestamp()+".png");
            casper2done = false;

        });

}).thenOpen("https://bituniverse.net/account",function(){

/***********************************************************************/
                              /* claiming */
/***********************************************************************/

    this.wait(3000,function(){

            current_balance = this.evaluate(function() {        
                return document.querySelector('span[style="font-size:18px;"]').textContent.match(/\d+/)[0];
            });

            console.log("current balance: "+current_balance);

             logged_in = this.evaluate(function(){

                return document.querySelector('.btn-lg').textContent; //if logged, then there's no -lg button on this page

            })

            //check if managed to login (first captcha didn't timeout). this saves $$ on captchas.
            if (logged_in==" Login"){
                    pusher(0,"failed to login",start_time,generateTimestamp());
                    console.log("failed to login. Check captcha id if correct: "+fs.read(application+'captchaid.txt'));
                    this.exit();
            }
            
            fs.remove(application+'captchaid.txt');
            fs.remove(application+'answer.txt');


            this.evaluate(function() {
            
                document.querySelector('.btn-sm').click(); 
            });


    });

    this.wait(1000,function(){

        this.evaluate(function(){

            document.querySelector('input[value="FaucetHub.io"]').click();
            this.capture(application+" withdrawing "+generateTimestamp()+".png");

        });

    });

    this.wait(2000, function(){
            this.capture(application+" claiming "+generateTimestamp()+".png");
            
            console.log("Saving Captcha [" + generateTimestamp("short")  +"]");
            this.captureSelector(application+'file23.png', '#adcopy-puzzle-image');
      
        });

   casper1.wait(100,function(){ //wait to start second page

            kwsolver(application+'file23.png',apikey);

        });


}).waitFor(function check(){ //wait for kswolver to finish
    return casper2done;
   
}).then(function(){

     this.wait(100,function(){
    
        this.capture(application+" claiming "+generateTimestamp()+".png");

            console.log("Answer fill-in [" + generateTimestamp("short")  +"]");            
            //this.capture("answering"+generateTimestamp()+".png");
            
            answer = fs.read(application+'answer.txt');
            console.log("answering: "+answer);


            this.evaluate(function(answer){
                          document.getElementById('adcopy_response').value=answer;
                            document.getElementById('button').click();
            },answer);
         
        });

}).then(function(){

     this.wait(2000,function(){
            new_balance = this.evaluate(function() {
            
                return document.querySelector('span[style="font-size:18px;"]').textContent.match(/\d+/)[0];
            });

        console.log("new balance: "+new_balance);
        this.capture(application+" withdrawn "+generateTimestamp()+".png");

        claimed=current_balance;

       /* claimed = this.evaluate(function(){    
                return document.querySelector('span[data-notify="message"]').textContent.match(/\d+/)[0];
        });
        */

        //if (claimed>0)
        if (new_balance==0)
        {
            console.log ("woo hoo! withdrawn "+ claimed +" satoshi / approx: "+current_balance*0.0009749+" PLN");
            type ="withdrawn";
        } else {
            console.log("something went wrong. no satoshi withdrawn!");
            type="failed";
        }

        fs.remove(application+'captchaid.txt');
        fs.remove(application+'answer.txt');
        casper2done = false;
        

     });


}).then(function(){

    pusher(claimed,type,start_time,generateTimestamp());

}).run(function(){


  //  console.log(claimed+type);

   // this.capture("operationDone "+generateTimestamp()+".png");
    console.log("Operation Done [" + generateTimestamp("short") +"]");
    console.log("** Next Run [" + generateTimestamp("shift") +"] **");
    cleaner("quiet");
    this.exit();

});

