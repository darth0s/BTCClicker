var fs = require('fs');
var page = require('webpage').create();     
var datum;
var current_timestamp;
var current_balance;
var type;
var msg;
var start_time=generateTimestamp();
var claimed;
var bitwallet = '1AVNfQQjEJCmst83oQH6RJUpbqkHZWe1W7';
var apikey = '6OSN9CJ6BGXUTAMPJM'; //9kw
var application = 'plansads';
var cooldown = 10; //cool down in minutes (before next run)
var captcha_timeout = 200000;

var captcha_wait=0;
var captcha_fetched;


//2captcha vars55
var application_googlekey='6Lc0QAgUAAAAAI7SvLNO_2WLfV51TTwO5AchAXgq'; //application specific
var apikey_2captcha = '2b4a3aa14720403833277c62c4d51080'; //2captcha
var pageurl ='http://plansads.com/bitcoin/'
var captchaid_2captcha;


/***********************************************************************/
    /* 2captcha - re2 api part.. probably don't need to change that */
/***********************************************************************/

function captchasolver(apikey_2captcha){

  var casper2 = require('casper').create({
              waitTimeout: 40000+captcha_timeout,
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

        casper2.on('error', function(msg,backtrace) {
          //console.log("I am in error handler!" +msg)
          pusher(0,'failed',start_time,generateTimestamp(),msg);
          casper1.exit();
          casper2.exit();
        });

        casper2.on('Timeout', function(msg,backtrace) {
          console.log("I am in timeout handler!" +msg)
          pusher(0,'failed',start_time,generateTimestamp(),msg);
          casper1.exit();
          casper2.exit();
        });

casper2.start("google.com");

casper2.then(function(){

  console.log("submitting recaptcha");

  this.open("http://2captcha.com/in.php?key="
      +apikey_2captcha+"&method=userrecaptcha&googlekey="
      +application_googlekey+"&pageurl="
      +pageurl)
}

 //http://2captcha.com/in.php?key=2b4a3aa14720403833277c62c4d51080&method=userrecaptcha&googlekey=6Lc0QAgUAAAAAI7SvLNO_2WLfV51TTwO5AchAXgq&pageurl=http://plansads.com/bitcoin

      ).then(function(){

        console.log("currently on: "+ this.getCurrentUrl());

            captchaid_2captcha = this.evaluate(function(){

                return document.querySelector('body').textContent.substr(3,document.querySelector('body').textContent.length-3);

            })

            if (captchaid_2captcha=='OR_ZERO_BALANCE')
            {
            
              claimed = 0;
              type = "captcha zero balance";
              end_time = generateTimestamp();

                casper1.waitFor(function check() {
                         return pusher(claimed,type,start_time,generateTimestamp(),"2captcha zero balance");

                }, function then() {
                  // console.log("failed to captcha - timeout. Check captcha id if solved: "+fs.read(application+'captchaid.txt'));
                   console.log(application + " failed to captcha - 2captcha zero balance");
                   casper1.exit();
                });


            }

           fs.write(application+'captchaid.txt',captchaid_2captcha, 'w');

            console.log("evaluated captcha id: "+captchaid_2captcha); //debug
            
            console.log("captcha answer url:" + "http://2captcha.com/res.php?key="+apikey_2captcha+"&action=get&id="+captchaid_2captcha );

            this.open("http://2captcha.com/res.php?key="+apikey_2captcha+"&action=get&id="+captchaid_2captcha);
//http://2captcha.com/res.php?key=2b4a3aa14720403833277c62c4d51080&action=get&id=3533268726


         // }).thenOpen("http://2captcha.com/res.php?key="+apikey_2captcha+"&action=get&id="+captchaid_2captcha).then(function(){
        
        }).then(function(){
              console.log("currently on: "+ this.getCurrentUrl());
               console.log("Check start "+application + " [" + generateTimestamp("short") +"]" );

              function issuccess(){
            
              casper2.then(function(){
             
                 
                  
                  this.reload(function(){

                          answer = this.evaluate(function(){
                          return document.querySelector('body').textContent;
                          });

                            if (answer.substr(0,2)=="OK")
                            {
                              answer=answer.substr(3,answer.length-3)
                            }

                          console.log("current_answer: "+ answer);

                          if(answer=="CAPCHA_NOT_READY" && captcha_wait < captcha_timeout/1000 ) {
                          
                             console.log("waiting one more: "+captcha_wait); //debug


                              this.wait(5000,function(){
                                  captcha_wait = captcha_wait + 5; //cumulative captcha wait in seconds
                          // console.log("waited: "+ captcha_wait + " seconds");
                                  issuccess();
                              })
                          } else {

                                  if(captcha_wait >= captcha_timeout/1000) {captcha_fetched=0;} else {captcha_fetched=1;}

                                  console.log("Check Finish "+application + " [" + generateTimestamp("short") +"]" );
                                  // console.log("Fetched answer is: "+ answer);
                                  fs.write(application+'answer.txt',answer, 'w');



                          };

                  });
              });
              }


                              issuccess();

          }).run(function(){

              console.log("Leaving Solver "+application + " [" + generateTimestamp("short") +"]" );
              casper2done = true;
          });
}


function pusher(claimed,type,start_time,end_time,details,application){ 

        // console.log('pusher pushed '+claimed+"|"+application+"|"+type+"|"+details+"|"+start_time+"|"+end_time);  

                casper1.open("http://meowbi.nazwa.pl/darth0s/btc/mysql_load.php", {
          
                  method: 'post',
                  data:{      
                      'value': claimed,
                      'portal': application,
                      'claim': type,
                      'start_time':start_time,
                      'end_time':end_time,
                      'details':details
                     }

                 },function(){
               //    console.log("currently on: "+ casper1.getCurrentUrl());
                 });

    return record_added=1;
}

/***********************************************************************/
    /* 9kw / captcha api part.. probably don't need to change that */
/***********************************************************************/
function kwsolver(fileName,apikey){

        var casper2 = require('casper').create({
            waitTimeout: 40000+captcha_timeout,
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

      casper2.on('error', function(msg,backtrace) {
        //console.log("I am in error handler!" +msg)
        pusher(0,'failed',start_time,generateTimestamp(),msg,application);
        casper1.exit();
        casper2.exit();
      });

      casper2.on('Timeout', function(msg,backtrace) {
        console.log("I am in timeout handler!" +msg)
        pusher(0,'failed',start_time,generateTimestamp(),msg,application);
        casper1.exit();
        casper2.exit();
      });

    casper2.start("https://www.9kw.eu/index.cgi?action=usercaptchaguthaben&apikey="+apikey).then(function(){

            balance = this.evaluate(function(){
                return document.querySelector('body').textContent;
            })

            if (balance<120){
            this.echo("Warning! low captcha credits: "+balance,'COMMENT');
            } else {
            console.log("current 9kw credits: "+balance);    
            }

            

        }).thenOpen("https://www.9kw.eu/grafik/form.html")
        .then(function(){
     //     casper2.start("https://www.9kw.eu/grafik/form.html").then(function(){

                            var captchaid;                  
                      
                            this.fillSelectors('form[action="/index.cgi"]', {
                                    'input[name="apikey"]':apikey,
                                    'input[name="file-upload-01"]': fileName
                                }, true);

        }).then(function(){

                            this.evaluate(function(){
                                document.getElementById("newsubmit").click();
                            });

                            this.capture(application+" captchaformfilled "+generateTimestamp()+".png");

                            console.log("Captcha Pushed "+application + " [" + generateTimestamp("short") +"]" );

                            this.then(function(){

                                captchaid = this.evaluate(function(){

                                return document.querySelector('body').textContent;

                                });

                            //   console.log("evaluating captchaid "+captchaid);

                                url = 'https://www.9kw.eu/index.cgi?action=usercaptchacorrectdata&prio=10&apikey='+apikey+'&id='+captchaid;

                                fs.write(application+'captchaid.txt',url, 'w');
                            });

                            }).then(function(){
                              //    console.log("opening url: "+url);

                                  this.open(url);

                              }).then(function(){

                        //    }).then(function(){
                            //       console.log("currently on: "+ this.getCurrentUrl());
                                   console.log("Check start "+application + " [" + generateTimestamp("short") +"]" );
                            }).then(function(){
                                                

                                  function issuccess(){
                                    casper2.then(function(){
                                   
                                        this.reload(function(){


                                            answer = this.evaluate(function(){

                                                        return document.querySelector('body').textContent;

                                                    });

                                          //  console.log("current_answer: "+ answer);
                                            
                                                 if(answer=="" && captcha_wait < captcha_timeout/1000 ) {
                                                 //   console.log("waiting one more");
                                                        this.wait(5000,function(){
                                                            captcha_wait = captcha_wait + 5; //cumulative captcha wait in seconds
                                                           // console.log("waited: "+ captcha_wait + " seconds");
                                                            issuccess();
                                                        })
                                                 } else {

                                                    if(captcha_wait >= captcha_timeout/1000) {captcha_fetched=0;} else {captcha_fetched=1;}

                                                        console.log("Check Finish "+application + " [" + generateTimestamp("short") +"]" );
                                                       // console.log("Fetched answer is: "+ answer);
                                                        fs.write(application+'answer.txt',answer, 'w');                                                                                                                                                           
                                                }



                                        });

                                    });
                                }


                                issuccess();

                                     

        }).run(function(){

            console.log("Leaving Solver "+application + " [" + generateTimestamp("short") +"]" );
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

var casper2done = false;


var casper1 = require('casper').create({
waitTimeout: 80000+captcha_timeout,  
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


casper1.on('error', function(msg,backtrace) {
  //console.log("I am in error handler!" +msg)
  pusher(0,'failed',start_time,generateTimestamp(),msg,application);
  casper1.exit();
});

casper1.on('Timeout', function(msg,backtrace) {
  console.log("I am in timeout handler!" +msg)
  pusher(0,'failed',start_time,generateTimestamp(),msg,application);
  casper1.exit();
});





/***********************************************************************/
            /* faucet specific navigation starts here */
/***********************************************************************/

casper1.start("https://www.google.com/finance?q=BTCPLN").then(function(){

this.echo("** starting " + application +" **",'GREEN_BAR');

        this.wait(100,function(){
           cleaner("quiet");
         });


          this.wait(2000,function(){

          //  this.capture(application+" plnratio "+generateTimestamp()+".png");

            plnratio=this.evaluate(function(){
              return document.querySelector('span.bld').textContent.replace(',','').match(/\d+/)[0];
            });

            plnratio = plnratio/100000000;

          //  console.log("pln ratio: "+plnratio*1000000 + "| satoshi: "+ plnratio);
          });

//cleanup previously generated screenshotsśs

}).thenOpen("http://plansads.com/bitcoin/",function(){

/***********************************************************************/
                              /* login */
/***********************************************************************/
   
        this.wait(1000,function(){
            
             this.capture(application+" initial "+generateTimestamp()+".png");
            console.log("Claim "+application + " [" + generateTimestamp("short")  +"]");
            
            this.evaluate(function(bitwallet) {
                document.querySelectorAll('input')[2].value = bitwallet
            },bitwallet);
}).then(function(){

    
   this.wait(100,function(){ //wait to start second page

        console.log("starting solver");

        captchasolver(apikey_2captcha);
     

    });


}).waitFor(function check(){ //wait for kswolver to finish
    return casper2done;

}).then(function(){ //answer checking module

    answer = fs.read(application+'answer.txt');

    if (answer=="" || answer=="CAPCHA_NOT_READY"){
        claimed = 0;
        type = "captcha timeout";
        end_time = generateTimestamp();
        console.log("evaluating fail"); //debug

            casper1.waitFor(function check() {
                     return pusher(claimed,type,start_time,generateTimestamp(),"url: "+fs.read(application+'captchaid.txt'),application);

            }, function then() {
              // console.log("failed to captcha - timeout. Check captcha id if solved: "+fs.read(application+'captchaid.txt'));
               console.log(application + " failed to 2captcha - timeout");
               casper1.exit();
            });
          }

}).then(function(){
   //back to the first page
    
    this.wait(1000,function(){

        this.capture(application+" captchafillin "+generateTimestamp()+".png");

        this.evaluate(function(answer){
          document.getElementById("g-recaptcha-response").textContent = answer;
        },answer);

    });


}).then(function(){


     this.wait(4000,function(){

        claimed = this.evaluate(function(){    
                return document.querySelector('div.alert-success').textContent.match(/\d+/)[0];
        });

        this.capture(application+" claimed "+generateTimestamp()+".png");


        if (claimed>0)
        {
            this.echo("woo hoo! claimed "+ claimed +" satoshi / approx: "+claimed*plnratio+" PLN",'TRACE');
            type ="claimed";
        } else {
            console.log("something went wrong. no satoshi for you!");
            type="failed";
            claimed=0;
            msg = "url: "+fs.read(application+'captchaid.txt')
            // return pusher(claimed,type,start_time,generateTimestamp(),"url: "+fs.read(application+'captchaid.txt'));

        }

        fs.remove(application+'captchaid.txt');
        fs.remove(application+'answer.txt');
        casper2done = false;
        

     });


}).then(function(){

  pusher(claimed,type,start_time,generateTimestamp(),msg,application);


}).run(function(){


   // console.log(claimed+type);

        console.log("Operation Done "+application + " [" + generateTimestamp("short") +"]");
        console.log("** Next Run "+application + " [" + generateTimestamp("shift") +"] **");
   cleaner("quiet");
    this.exit();

});