const express = require('express');
const http = require('http');
const path = require('path');
const mysql = require('mysql')
const bodyParser = require('body-parser');
const mailer = require('nodemailer'); //this is for sending mail
// const config = require('./config/config'); //config file with db and email info
//config leaves in config directory
const app = express();
const port = process.env.PORT || 3000; //configures to available port based on
//enviroment variable or port 3000 by default - for easier management
// json is an option of bodyParser
// app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false})); //what is urlencoded

//creating static path from the root of our harddrive to public folder
app.use(express.static(__dirname + '/public'));
//the following allows not to use default rendering engine
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})


// setup database
// var db = mysql.createConnection(config.db);
// db.connect ((error) => { //connecting to our database
//     if (error){
//         console.log('could not connect to database')
//         throw error;// commented out so the server would not crash
//         return;
//     }else{
//         console.log("connection to db = success!");
//     }
// })
//db veryfied

//mailer setup
// var smtpTransport = mailer.createTransport(config.mailer);
// smtpTransport.verify((error)=>{//to verify connection use this
//     if(error){
//         console.log('smtpProtocol error', error);
//     }else{
//         console.log('server is ready to send email messages!')
//     }
// })
//mailer veryfied

var server = http.createServer(app);
const date = new Date()

app.use((req, res, next) => { //logging info about date, location and method used
    var now = date.toString();
    var log = `${now}: ${req.url} ${req.method}`;
    console.log(log);
    // fs.appendFile('server.log', log + '\n', (error) => { //where '\n' is a new line character
    //     if (error) { console.log("unable to append to server log") }
    // });
    next();
});

// the following to serve welcome page
app.get('/', (req, res) => {
    console.log('someone came to our page')
    res.sendFile('index.html');
});

//reading from contact form
app.post('/registerForm', (req, res)=>{
    console.log('receiving data from registration page')
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password2;
    const child_name = req.body.child_name;
    const relationship = req.body.relationship;
    const child_username = req.body.child_username;
    const fav_color = req.body.favorite_color;
    const gender = req.body.boygirl;

    const hash = bcrypt.hashSync(password);
    console.log(first_name, last_name, email, password, child_name, relationship, child_username, gender)
    const selectQuery = `SELECT pw,child_name FROM parents WHERE email = ?;`;
    // console.log(hash);
    const dbQuery = db.query(selectQuery, [email],(error, results)=>{
        // console.log(dbQuery);
        //did this return a row? If so, the user already exists
        if (results.length != 0){
            console.log("user's child is in database, must login now: ", child_name)
            res.render('index',{
                onLoad: 1
             });
        }else{
            //this is a new user - insert them - user must register
            console.log('user must be inserted')
            const insertQuery = `INSERT INTO parents (first_name, last_name, email, pw, child_name, relationship, child_username, fav_color, gender) VALUES (?,?,?,?,?,?,?,?,?);`;
            // const childQuery = `SELECT child_name FROM parents where email = ?;`;
            db.query(insertQuery, [first_name, last_name, email, hash, child_name, relationship, child_username, fav_color, gender], (error)=>{
                if (error){
                    console.log('error inserting into database')
                    // throw error;
                    return
                }else{
                    console.log('succesful insertion into databse, automatic login next');
                    console.log('child_name: ', child_name, 'childs: ', gender);
                    //serving the right avatar for a child
                    (gender==='boy') ? child="images/iconKid.svg" : child="images/iconKid2.png";
                    console.log('producing avatar', child);
                    res.render('chatBot',{
                        greeting: `Hello ${child_name}!`,
                        child_avatar: child,
                        email: email
                    });
                    
                }
            })
        }
    })
})
//the following is to get chatBot transcript
app.post('/send',(req, res)=>{
    console.log('message came to our send route')
    console.log(req.body)
    // let email = req.body.email;
    // console.log('receiving transcript', transcript, typeof(transcript));
    // console.log('receiving email', email, typeof(email));
    //     let mailOptions={
    //     to : email,
    //     subject : 'chatBot transcript',
    //     text: transcript
    //     }
    //     console.log(mailOptions);
    //     res.end('success');
    //     smtpTransport.sendMail(mailOptions, function(error, response){
    //     if(error){
    //         console.log("error occured when sending mail, terminating response process", error);
    //         res.end("error");
    //     }else{
    //         // console.log(JSON.stringify(response))
    //         console.log("Message sent, terminating response process");
    //         res.end("success");
    //     }
    // });
});
    


server.listen(port, (error) => {
    (error) ? console.log("your code sucks"): console.log(`listening on port ${port}`);
});
