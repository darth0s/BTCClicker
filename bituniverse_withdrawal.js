

var fs = require('fs');
var page = require('webpage').create();     

function generateTimestamp(version){

    var today = new Date();
    var d= today.getDay();
    var mm= today.getMonth();
    var y = today.getYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var mili = today.getMilliseconds();

if (version =="short")
{

    return "20"+String(y)+"_"+String(mm)+"_"+String(d)+"-"+String(h)+String(m)+String(s)+String(mili);
}else {

    return String(y)+String(mm)+String(d)+String(h)+String(m)+String(s)+String(mili);
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

casper1.start("https://bituniverse.net/account").then(function(){
    //casper1.capture("casper1_1.png");
   

        this.wait(1000,function(){
            
            console.log("1st wait");
            
            this.evaluate(function() {
                document.querySelector('input[name=address]').value = '1AVNfQQjEJCmst83oQH6RJUpbqkHZWe1W7';
                document.querySelector('.btn-lg').click(); 
            });

      // this.capture("bituniverse1"+ generateTimestamp()+".jpg");
        });


        this.wait(1000,function(){
  	      this.capture("bituniverseAccount"+ generateTimestamp("short")+".jpg");
        	won = this.evaluate(function(){
  				document.querySelector('span')[7].textContent; 
        	});
            
            console.log("withdrawing: " + won);
            
            this.evaluate(function() {
                document.querySelector('.btn-sm').click(); 
            });



      // this.capture("bituniverse1"+ generateTimestamp()+".jpg");
        });

      this.wait(1000,function(){
  	      this.capture("bituniverseAccount"+ generateTimestamp("short")+".jpg");

      // this.capture("bituniverse1"+ generateTimestamp()+".jpg");
        });


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
                   // console.log("currently on: "+this.getTitle() +" | " + this.getCurrentUrl());
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

                                    //this.capture("9kw1"+generateTimestamp()+".png");

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
                                            console.log("fetched answer is: "+ answer);
                                            fs.write('C:\\dev\\js_dev\\node\\answer.txt',answer, 'w');

                                         // this.capture("9kw1"+generateTimestamp(short)+".png");

                                            fs.remove('captchaid.txt');
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
    

        this.wait(100,function(){

            console.log("4th wait");
            console.log("currently on: "+this.getTitle() +" | " + this.getCurrentUrl());
            
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
            this.capture("answering"+generateTimestamp("short")+".png");
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
    this.echo("DONE");
    this.exit();
});

/*
}).thenOpen("https://bitlucky.io/account",function(){

    this.wait(1000,function(){
        console.log("withdrawing");
        this.evaluate(function() {
                document.querySelector('.btn-sm').click(); 
        });


         this.capture("withdraw"+generateTimestamp("short")+".png");

    });
    */