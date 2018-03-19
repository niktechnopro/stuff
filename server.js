const express = require('express');
const http = require('http');
const path = require('path');
const mysql = require('mysql')
const bodyParser = require('body-parser');
const mailer = require('nodemailer'); //this is for sending mail
const config = require('./config/config'); //config file with db and email info
//config leaves in config directory
// console.log(config)
const app = express();
const port = process.env.PORT || 3000; //configures to available port based on
//enviroment variable or port 3000 by default - for easier management
// json is an option of bodyParser
// app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false})); //what is urlencoded

//creating static path from the root of our harddrive to public folder
app.use(express.static(__dirname + '/public'));

// app.use(function(req, res, next){
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// })

// creating a server
var server = http.createServer(app);
// setup database
var db = mysql.createConnection(config.db);
db.connect ((error) => { //connecting to our database
    if (error){
        console.log('could not connect to database')
        //throw error;// commented out so the server would not crash
        return;
    }else{
        console.log("connection to db = success!");
    }
})
//db veryfied

// console.log(config.myemail)
//mailer setup
var smtpTransport = mailer.createTransport(config.mailer);
smtpTransport.verify((error)=>{//to verify connection use this
    if(error){
        console.log('smtpProtocol error', error);
        return
    }else{
        console.log('server is ready to send email messages!')
        return
    }
})
//mailer veryfied


const date = new Date()

app.use((req, res, next) => { //logging info about date, location and method used
    var now = date.toString();
    var log = `${now}: ${req.url} ${req.method}`;
    console.log('this is happening', log);
    // fs.appendFile('server.log', log + '\n', (error) => { //where '\n' is a new line character
    //     if (error) { console.log("unable to append to server log") }
    // });
    next();
});

// the following to serve welcome page
app.get('/', (req, res) => {
    console.log('someone came to our page')
    // res.sendFile('index.html');
    res.sendFile(__dirname + '/public/index.html');
});


//the following is to get chatBot transcript
app.post('/send',(req, res)=>{
    console.log('message came to our send route: ', req.body)
    let message = req.body;
    let myJSON = JSON.stringify(message)
    let mailOptions={//email options
                to : config.myemail,
                subject : 'someone is interested in you',
                text: myJSON
                }
    // console.log(mailOptions)
    // console.log(req.body.name)
    const insertQuery = `INSERT INTO joboffertable (name, email, message) VALUES (?,?,?);`
    var mydbPromise = new Promise(function(resolve, reject){
        db.query(insertQuery, [message.name, message.email, message.message], (error, result)=>{
            if (error){
                console.log("error inserting into database");
                reject(error)
            }else{
                console.log("succesful insertion into database");
                resolve({message : 'success'})//this is what passed as argument in then
            }
        })
    })
    mydbPromise.then((dbresults)=>{
            // console.log(dbresults);
            var mailerPromise = new Promise((resolve, reject)=>{
                smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log("error occured when sending mail, terminating response process", error);
                    reject(error)
                }else{
                    console.log("Message sent, terminating response process");
                    resolve({message : 'success'})
                    }
                })
            }).then((mailerresults)=>{
                // console.log(mailerresults);
                res.json(mailerresults);
            })
        }).catch((error)=>{
            console.log('error occured: ', error);
        })
});
    


server.listen(port, (error) => {
    (error) ? console.log("your code sucks"): console.log(`listening on port ${port}`);
});
