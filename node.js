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
        createzerovaluedskills(req.body.username);
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
    insertFeed(req.body.username, 'added new company ' + toTitleCase(req.body.companyname));

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

app.post('/addinternship', function (req, res) {
    console.log('addinternship:' + req.body.username);
    insertFeed(req.body.username, 'added new internship');

    var rows = [];
    var queryString = "INSERT INTO internship (studentid, type, companyid, "+
            "notes) VALUES ('" + 
    req.body.username + "', '" +  
    req.body.type + "', '" +  
    req.body.companyid + "', '" +  
    req.body.notes + "');";

    var query = baseClient.query(queryString);
    res.json('added');
});

function createzerovaluedskills(username){
    var queryString = "INSERT INTO skill (studentid) values('" + username + "');";
    if(baseClient != null)
    var query = baseClient.query(queryString);
}

app.post('/updateskill', function (req, res) {
    console.log('updateskill:' + req.body.username);
    insertFeed(req.body.username, 'updated skills set');

    var rows = [];
    var queryString = "UPDATE skill SET " +
    "asp_dot_net = '" + parseInt(req.body.asp_dot_net) + "," + 
    "c = '" + parseInt(req.body.c) + "," + 
    "cplusplus = '" + parseInt(req.body.cplusplus) + "," + 
    "csharp = '" + parseInt(req.body.csharp) + "," + 
    "flex = '" + parseInt(req.body.flex) + "," + 
    "java = '" + parseInt(req.body.java) + "," + 
    "javascript = '" + parseInt(req.body.javascript) + "," + 
    "lisp = '" + parseInt(req.body.lisp) + "," + 
    "matlab = '" + parseInt(req.body.matlab) + "," + 
    "mysql = '" + parseInt(req.body.mysql) + "," + 
    "objectivec = '" + parseInt(req.body.objectivec) + "," + 
    "pascal = '" + parseInt(req.body.pascal) + "," + 
    "perl = '" + parseInt(req.body.perl) + "," + 
    "php = '" + parseInt(req.body.php) + "," + 
    "prolog = '" + parseInt(req.body.prolog) + "," + 
    "python = '" + parseInt(req.body.python) + "," + 
    "r = '" + parseInt(req.body.r) + "," + 
    "ruby = '" + parseInt(req.body.ruby) + "," + 
    "sql_oracle = '" + parseInt(req.body.sql_oracle) + "," + 
    "tcl = '" + parseInt(req.body.tcl) + "," + 
    "t_sql = '" + parseInt(req.body.t_sql) + "," + 
    "vb_dot_net = '" + parseInt(req.body.vb_dot_net) + "," + 
    "concrete = '" + parseInt(req.body.concrete) + "," + 
    "dotnetnuke = '" + parseInt(req.body.dotnetnuke) + "," + 
    "drupal = '" + parseInt(req.body.drupal) + "," + 
    "joomla = '" + parseInt(req.body.joomla) + "," + 
    "wordpress = '" + parseInt(req.body.wordpress) + "," + 
    "android = '" + parseInt(req.body.android) + "," + 
    "chromeos = '" + parseInt(req.body.chromeos) + "," + 
    "ios = '" + parseInt(req.body.ios) + "," + 
    "linux = '" + parseInt(req.body.linux) + "," + 
    "macos = '" + parseInt(req.body.macos) + "," + 
    "unix = '" + parseInt(req.body.unix) + "," + 
    "windows = '" + parseInt(req.body.windows) + "' where " +
    "studentid = '" + req.body.username + "';"; 
    console.log(queryString)
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