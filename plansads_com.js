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
var application = 'plansads';
var cooldown = 10; //cool down in minutes (before next run)



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
    });
      console.log('pusher pushed: '+claimed+"|"+application+"|"+type+"|"+start_time+"|"+end_time);
}


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
                                            

                                           if (answer=="") {
                                               pusher(0,"failed to captcha",start_time,generateTimestamp());
                                                console.log("failed to captcha. Check captcha id if correct: "+fs.read(application+'captchaid.txt'));
                                                casper1.exit();
                                                this.exit();
                                            }

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


var shifteddate = new Date();
shifteddate.setTime(currentdate.getTime()+(cooldown*60*1000));

var datetimeshift  = shifteddate.getDate() + "_"
                + (shifteddate.getMonth()+1)  + "_" 
                + shifteddate.getFullYear() + " | "  
                + shifteddate.getHours() + "_"  
                + shifteddate.getMinutes() + "_" 
                + shifteddate.getSeconds();

        if (version =="short")
        {

            return datetime;

        }else if(version=="shift") {

            return datetimeshift 

        }else {

            return datetimesafe
            
        }

}

var casper1 = require('casper').create({
waitTimeout: 150000, 
//verbose:true,
//logLevel:"debug",
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

}).thenOpen("http://www.plansads.com/",function(){

/***********************************************************************/
                              /* login */
/***********************************************************************/
   
        this.wait(1000,function(){
            
             this.capture(application+" initial "+generateTimestamp()+".png");
            console.log("Claim [" + generateTimestamp("short")  +"]");
            
            this.evaluate(function(bitwallet) {
                //document.querySelector('input.form-control').value = bitwallet;
                document.querySelectorAll('input')[2].value = bitwallet;
              //  document.querySelector('.btn-lg').click(); 
                //document.getElementById('button').click();

            },bitwallet);

           // this.capture("1.wallet "+generateTimestamp()+".png");

      // this.capture("bituniverse"+ generateTimestamp()+".png");
        });

        this.wait(500, function(){
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


            console.log("Claim Answer fill-in [" + generateTimestamp("short")  +"]");            
          
            this.capture(application+" claiming "+generateTimestamp()+".png");
            
            answer = fs.read(application+'answer.txt');

            console.log("answering: "+answer);

            this.evaluate(function(answer){
                        document.getElementById('adcopy_response').value=answer;
                     document.querySelector('.btn-lg').click(); 
            },answer);
         
            this.capture(application+" initial "+generateTimestamp()+".png");

        });


        this.wait(500,function(){

            this.capture(application+" claimed "+generateTimestamp()+".png");

         //   fs.remove('captchaid.txt');
          //  fs.remove('answer.txt');
            casper2done = false;

        });

}).then(function(){


     this.wait(4000,function(){

        claimed = this.evaluate(function(){    
                return document.querySelector('div.alert-success').textContent.match(/\d+/)[0];
        });

        this.capture(application+" claimed "+generateTimestamp()+".png");


        if (claimed>0)
        {
            console.log ("woo hoo! claimed "+ claimed +" satoshi / approx: "+claimed*0.0009749+" PLN");
            type ="claimed";
        } else {
            console.log("something went wrong. no satoshi for you!");
            console.log("check if captchaid is ok: "+fs.read(application+'captchaid.txt'));
            type="failed";
        }

        fs.remove(application+'captchaid.txt');
        fs.remove(application+'answer.txt');
        casper2done = false;
        

     });


}).then(function(){

  pusher(claimed,type,start_time,generateTimestamp());


}).run(function(){


   // console.log(claimed+type);

        console.log("Operation Done [" + generateTimestamp("short") +"]");
        console.log("** Next Run [" + generateTimestamp("shift") +"] **");
//    cleaner("quiet");
    this.exit();

});

