var fs = require('fs');
var page = require('webpage').create();     
var datum;
var current_timestamp;
var current_balance;
var new_balance;
var image_url;
var start_time;
var record_added;
var type;
var msg;
var claimed;
var captchaid;       
var bitwallet = '1AVNfQQjEJCmst83oQH6RJUpbqkHZWe1W7';
var apikey = '6OSN9CJ6BGXUTAMPJM'; //9kw
var application = 'getfree_coin_BCC';
var cooldown=5;
var captcha_timeout = 200000;

var captcha_wait=0;
var captcha_fetched;


document.writeln("<script src='https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js'></script>");
document.writeln("<script src='https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/md5.js'></script>");


function pusher(claimed,type,start_time,end_time,details,application,operation,next_run_time){ 

//   pusher(new_balance,'balance',start_time,generateTimestamp(),'');

        // console.log('pusher pushed '+claimed+"|"+application+"|"+type+"|"+details+"|"+start_time+"|"+end_time);  



                casper1.open("http://meowbi.nazwa.pl/darth0s/btc/mysql_load.php", {

                  method: 'post',
                  data:{      
                      'value': claimed,
                      'portal': application,
                      'claim': type,
                      'start_time':start_time,
                      'end_time':end_time,
                      'details':details,
                      'operation':operation,
                      'next_run_time':next_run_time
                     }

                 },function(){
                   push_message = this.evaluate(function(){
                      document.querySelector('body').textContent;
                    });

                      console.log("push message: "+push_message);
               //    console.log("currently on: "+ casper1.getCurrentUrl());
                 });


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

            if (md5=="SH97IvaDEtLBu8k7GupEWw==")
            {
              console.log("possible Januvia");
            } else {

              console.log("doesn't look like januvia");
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


/* end of functions */

var casper1 = require('casper').create({
  waitTimeout: 80000+captcha_timeout, 
  
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
  console.log("I am in error handler!" +msg)
  pusher(0,'failed',start_time,generateTimestamp(),msg,application);
  casper1.exit();
});

casper1.on('Timeout', function(msg,backtrace) {
  console.log("I am in timeout handler!" +msg)
  pusher(0,'failed',start_time,generateTimestamp(),msg,application);
  casper1.exit();
});

var casper2done = false;
start_time=generateTimestamp();




/***********************************************************************/
            /* faucet specific navigation starts here */
/***********************************************************************/

casper1.start("https://www.google.com/finance?q=BCCPLN").then(function(){
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

         //   console.log("pln ratio: "+plnratio*1000000 + "| satoshi: "+ plnratio);
          });

//cleanup previously generated screenshots

}).thenOpen("http://getfree.co.in/bcash/",function(){
/***********************************************************************/
                              /* login */
/***********************************************************************/
   
        this.wait(2000,function(){
            
            console.log("Opening "+application + " [" + generateTimestamp("short")  +"]");
            this.capture(application+" initial "+generateTimestamp()+".png");

           // console.log(bitwallet);

        

            this.evaluate(function(bitwallet) {
                document.querySelector('input.form-control').value = bitwallet;
               // document.querySelector('.btn-lg').click(); 
            },bitwallet);

      // this.capture("bituniverse"+ generateTimestamp()+".png");
        });

}).then(function(){ //answer checking module

      this.wait(10000,function(){
            
         this.evaluate(function() {
                document.querySelector('input[type=submit]').click();
               // document.querySelector('.btn-lg').click(); 
            });

      // this.capture("bituniverse"+ generateTimestamp()+".png");
        });


}).then(function(){ //answer checking module

        this.wait(7000, function(){
            this.capture(application+" captchaScreen "+generateTimestamp()+".png");
            console.log("Saving Captcha "+application + " [" + generateTimestamp("short")  +"]");
            this.captureSelector(application+'file22.png', '#adcopy-puzzle-image');

        });

this.wait(2000, function(){

  captcha_object = this.evaluate(function(){

    return document.querySelector("#adcopy-puzzle-image-image").src;
  })


  md5= CryptoJS.MD5(captcha_object).toString(CryptoJS.enc.Base64);
  
});


       casper1.wait(100,function(){ //wait to start second page

            kwsolver(application+'file22.png',apikey);

        });


}).waitFor(function check(){ //wait for kswolver to finish
    return casper2done;

}).then(function(){ //answer checking module

        answer = fs.read(application+'answer.txt');

        if (answer==""){
            claimed = 0;
            type = "captcha timeout";
            end_time = generateTimestamp();

                casper1.waitFor(function check() {
                         return pusher(claimed,type,start_time,generateTimestamp(),"url: "+fs.read(application+'captchaid.txt'),application);

                }, function then() {
               //    console.log("failed to captcha - timeout. Check captcha id if solved: "+fs.read(application+'captchaid.txt'));
                console.log(application + " failed to captcha - timeout");
                   casper1.exit();
                });

        }



}).then(function(){
   //back to the first page
    
        this.wait(100,function(){


            console.log("Answer fill-in "+application + " [" + generateTimestamp("short")  +"]");            
          
            this.capture(application+" asnwering "+generateTimestamp()+".png");
            
            answer = fs.read(application+ 'answer.txt');

          //  console.log("answering: "+answer);

            this.evaluate(function(answer){
                        document.getElementById('adcopy_response').value=answer;
                      //  document.getElementById('button').click();
            },answer);
         
        });

        this.wait(500,function(){

            this.capture(application + " loging "+generateTimestamp()+".png");
            casper2done = false;

        });

}).then(function(){

/***********************************************************************/
                              /* claiming */
/***********************************************************************/

          this.wait(1000,function(){

            this.evaluate(function() {  
                document.querySelector('input[type=submit]').click();         
            //    document.querySelector('.btn-lg').click(); 
            });

        })



 }).then(function(){   

        this.wait(2000,function(){


                    this.capture(application+" claimed0 "+generateTimestamp()+".png");

                    current_balance = this.evaluate(function() {
                    
                       return document.querySelector('div.alert.alert-success').textContent.match(/\d+/)[0];
                    });


                   claimed = current_balance;

                        if (claimed>0)
                        {
                            this.echo("woo hoo! claimed "+ claimed +" satoshi / approx: "+claimed*plnratio+" PLN",'TRACE');
                            type ="claimed";
                        } else {
                            console.log("something went wrong. no satoshi for you!");
                            type="failed";
                            claimed=0;
                            msg = "url: "+fs.read(application+'captchaid.txt')
                        }

            });

}).then(function(){

        fs.remove(application+'captchaid.txt');
        fs.remove(application+'answer.txt');
        casper2done = false;

}).then(function(){
    
    pusher(claimed,type,start_time,generateTimestamp(),msg,application);


}).run(function(){


//    console.log(claimed+type);
    this.capture(application+" operationDone "+generateTimestamp()+".png");
    console.log("Operation Done "+application + " [" + generateTimestamp("short") +"]");
    

    if (type="claimed"){
        console.log("** Next Run "+application + " [" + generateTimestamp("shift") +"] **");
      } else {
        console.log("** Next Run "+application + " [" + generateTimestamp("short") +"] **");
      }
      
    
    cleaner("quiet");
    this.exit();

});

