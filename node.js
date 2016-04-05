var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var pg = require('pg');

var bodyParser = require('body-parser');
var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("Listening on %d", port)

var baseClient;
pg.connect(process.env.DATABASE_URL, function(err, client) {
	baseClient = client;
});
var that = this;

function insertFeed(studentid, value){
    var queryString = "INSERT INTO feed (studentid, value, datetime) values('" + studentid + "', '" + value + "',now());";
    if(baseClient != null)
    var query = baseClient.query(queryString);
}

app.post('/login', function (req, res) {
    console.log('login:' + req.body.username);
    
    insertFeed(req.body.username, 'logged in');
    var rows = [];
    var queryString = "SELECT * FROM login where username = '" + req.body.username + "' and password='" + req.body.password + "';";
	var query = baseClient.query(queryString);
	query.on('row', function(row) {
		rows.push(row);
	});
	query.on('end', function(result) {
	    console.log('login: ' + result.rowCount + ' rows');
	    // console.log(rows);
		res.json(rows);
	});
});

app.post('/updatepassword', function (req, res) {
    console.log('updatepassword:' + req.body.username);
    
    var rows = [];
    var queryString = "SELECT * FROM login where username = '" + req.body.username + "' and password='" + req.body.password + "';";
    var query = baseClient.query(queryString);
    query.on('row', function(row) {
        rows.push(row);
        insertFeed(req.body.username, 'changed password');
        var queryStringInner = "UPDATE login SET password = '" + req.body.newpassword +"' where username = '" + req.body.username + "';";
        console.log(queryStringInner);
        var queryInner = baseClient.query(queryStringInner);
        res.json('password changed');
    });
    query.on('end', function(result) {
        console.log('updatepassword: ' + result.rowCount + ' rows');
        if(result.rowCount == 0)
        res.json('password not changed');
    });
});

app.post('/createaccount', function (req, res) {
    console.log('createaccount:' + req.body.username);
    console.log('createaccount:' + req.body.type);
    if(req.body.type == 'admin'){
        if(req.body.promo == 'macadmin'){
            insertFeed(req.body.username, 'created a new account');
            createaccount(req.body.username, req.body.password, req.body.photoid, req.body.type);            
        }else{
            res.json('invalid promo code');
        }
    }else{
        insertFeed(req.body.username, 'created a new student account');
        createaccount(req.body.username, req.body.password, req.body.photoid, req.body.type);       
        createstudent(req.body.username, req.body.firstname, req.body.middlename, 
            req.body.lastname, req.body.email, req.body.telephone, req.body.gender, 
            req.body.residentstatus, req.body.country, req.body.semesterregistered,
            req.body.internshipstatus);
    }
    res.json('created');
});

function createaccount(username, password, photoid, type){
    var rows = [];
    var queryString = "INSERT INTO login (username, password, photoid, type) VALUES ('" + 
    username + "', '" + 
    password + "', '" + 
    photoid + "', '" + 
    type + "');";

    var query = baseClient.query(queryString);
    query.on('row', function(row) {
        rows.push(row);
    });
    query.on('end', function(result) {
        console.log('createaccount: ' + result.rowCount + ' rows');
    });
}

function createstudent(username, firstname, middlename, 
            lastname, email, telephone, gender, 
            residentstatus, country, semesterregistered, internshipstatus){
    var rows = [];
    var queryString = "INSERT INTO student (studentid, firstname, middlename, "+
            "lastname, email, telephone, gender, " +
            "residentstatus, country, semesterregistered, internshipstatus) VALUES ('" + 
    username + "', '" +  
    firstname + "', '" +  
    middlename + "', '" +  
    lastname + "', '" +  
    email + "', '" +  
    telephone + "', '" +  
    gender + "', '" +  
    residentstatus + "', '" +  
    country + "', '" +  
    semesterregistered + "', '" +  
    internshipstatus + "');";

    var query = baseClient.query(queryString);
    query.on('row', function(row) {
        rows.push(row);
    });
    query.on('end', function(result) {
        console.log('createaccount: ' + result.rowCount + ' rows');
    });
}

app.post('/updatestudent', function (req, res) {
    console.log('updatestudent:' + req.body.username);
    insertFeed(req.body.username, 'updated student information');
    updatestudent(req.body.username, req.body.firstname, req.body.middlename, 
        req.body.lastname, req.body.email, req.body.telephone, req.body.gender, 
        req.body.residentstatus, req.body.country, req.body.semesterregistered, 
        req.body.internshipstatus);
    res.json('updated');
});

function updatestudent(username, firstname, middlename, 
            lastname, email, telephone, gender, 
            residentstatus, country, semesterregistered, internshipstatus){
    var rows = [];
    var queryString = "UPDATE student SET " +
    "firstname = '" + firstname + "', " +  
    "middlename = '" + middlename + "', " +  
    "lastname = '" + lastname + "', " +  
    "email = '" + email + "', " +  
    "telephone = '" + telephone + "', " +  
    "gender = '" + gender + "', " +  
    "residentstatus = '" + residentstatus + "', " +  
    "country = '" + country + "', " +  
    "semesterregistered = '" + semesterregistered + "', " +  
    "internshipstatus = '" + internshipstatus + "' where " +
    "studentid = '" + username + "';";    

    var query = baseClient.query(queryString);
    query.on('row', function(row) {
        rows.push(row);
    });
    query.on('end', function(result) {
        console.log('createaccount: ' + result.rowCount + ' rows');
    });
}

app.post('/addeducation', function (req, res) {
    console.log('addeducation:' + req.body.username);
    insertFeed(req.body.username, 'added new education information');

    var rows = [];
    var queryString = "INSERT INTO education (studentid, degreetype, major, "+
            "gpa, university, location, certifications) VALUES ('" + 
    req.body.username + "', '" +  
    req.body.degreetype + "', '" +  
    req.body.major + "', '" +  
    req.body.gpa + "', '" +  
    req.body.university + "', '" +  
    req.body.location + "', '" +  
    req.body.certifications + "');";

    var query = baseClient.query(queryString);
    res.json('added');
});

app.post('/addworkexperience', function (req, res) {
    console.log('addworkexperience:' + req.body.username);
    insertFeed(req.body.username, 'added new work experience');

    var rows = [];
    var queryString = "INSERT INTO workexperience (studentid, companyid, location, "+
            "startdate, enddate, position) VALUES ('" + 
    req.body.username + "', '" +  
    req.body.companyid + "', '" +  
    req.body.location + "', '" +  
    req.body.startdate + "', '" +  
    req.body.enddate + "', '" +  
    req.body.position + "');";

    var query = baseClient.query(queryString);
    res.json('added');
});

app.post('/addcompany', function (req, res) {
    console.log('addcompany:' + req.body.username);
    insertFeed(req.body.username, 'added new company ' + toTitleCase(companyname));

    var rows = [];
    var queryString = "INSERT INTO company (photoid, companyname, address, "+
            "city, postalcode, country, contactpersonfirstname, contactpersonlastname, "+
            "contactpersonposition, telephone, email, companywebsite) VALUES ('" + 
    req.body.photoid + "', '" +  
    req.body.companyname + "', '" +  
    req.body.address + "', '" +  

    req.body.city + "', '" +  
    req.body.postalcode + "', '" +  
    req.body.country + "', '" +  
    req.body.contactpersonfirstname + "', '" +  
    req.body.contactpersonlastname + "', '" +  

    req.body.contactpersonposition + "', '" +  
    req.body.telephone + "', '" +  
    req.body.email + "', '" +  
    req.body.companywebsite + "');";

    var query = baseClient.query(queryString);
    res.json('added');
});















function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function parseTwitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return "on " + system_date;
}