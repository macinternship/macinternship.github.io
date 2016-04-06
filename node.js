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

app.post('/addjob', function (req, res) {
    console.log('addjob:' + req.body.username);
    insertFeed(req.body.username, 'posted a new job');

    var rows = [];
    var queryString = "INSERT INTO job (companyid, position, description, "+
            "responsibilities, requirements, salary, availability) VALUES ('" + 
    req.body.companyid + "', '" +  
    req.body.position + "', '" +  
    req.body.description + "', '" +  
    req.body.responsibilities + "', '" +  
    req.body.requirements + "', '" +  
    req.body.salary + "', '" +  
    req.body.availability + "');";

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
    "asp_dot_net = " + req.body.asp_dot_net + "," + 
    "c = " + req.body.c + "," + 
    "cplusplus = " + req.body.cplusplus + "," + 
    "csharp = " + req.body.csharp + "," + 
    "flex = " + req.body.flex + "," + 
    "java = " + req.body.java + "," + 
    "javascript = " + req.body.javascript + "," + 
    "lisp = " + req.body.lisp + "," + 
    "matlab = " + req.body.matlab + "," + 
    "mysql = " + req.body.mysql + "," + 
    "objectivec = " + req.body.objectivec + "," + 
    "pascal = " + req.body.pascal + "," + 
    "perl = " + req.body.perl + "," + 
    "php = " + req.body.php + "," + 
    "prolog = " + req.body.prolog + "," + 
    "python = " + req.body.python + "," + 
    "r = " + req.body.r + "," + 
    "ruby = " + req.body.ruby + "," + 
    "sql_oracle = " + req.body.sql_oracle + "," + 
    "tcl = " + req.body.tcl + "," + 
    "t_sql = " + req.body.t_sql + "," + 
    "vb_dot_net = " + req.body.vb_dot_net + "," + 
    "concrete = " + req.body.concrete + "," + 
    "dotnetnuke = " + req.body.dotnetnuke + "," + 
    "drupal = " + req.body.drupal + "," + 
    "joomla = " + req.body.joomla + "," + 
    "wordpress = " + req.body.wordpress + "," + 
    "android = " + req.body.android + "," + 
    "chromeos = " + req.body.chromeos + "," + 
    "ios = " + req.body.ios + "," + 
    "linux = " + req.body.linux + "," + 
    "macos = " + req.body.macos + "," + 
    "unix = " + req.body.unix + "," + 
    "windows = " + req.body.windows + "' where " +
    "studentid = '" + req.body.username + "';"; 
    console.log(queryString)
    var query = baseClient.query(queryString);
    res.json('added');
});

app.post('/addstudentjobachieved', function (req, res) {
    console.log('addstudentjobachieved:' + req.body.username);
    insertFeed(req.body.username, 'got a new job');

    var rows = [];
    var queryString = "INSERT INTO student_job_achieved (studentid, jobid) VALUES ('" + 
    req.body.username + "', '" +  
    req.body.jobid + "');";

    var query = baseClient.query(queryString);
    res.json('added');
});

app.post('/addstudentjobinterest', function (req, res) {
    console.log('addstudentjobinterest:' + req.body.username);
    insertFeed(req.body.username, 'is interested in a job');

    var rows = [];
    var queryString = "INSERT INTO student_job_interest (studentid, jobid) VALUES ('" + 
    req.body.username + "', '" +  
    req.body.jobid + "');";

    var query = baseClient.query(queryString);
    res.json('added');
});

app.post('/removestudentjobachieved', function (req, res) {
    console.log('removestudentjobachieved:' + req.body.username);
    insertFeed(req.body.username, 'is removed from a job');

    var rows = [];
    var queryString = "DELETE FROM student_job_achieved WHERE " + 
    "studentid = '" + req.body.username + "' AND " +  
    "jobid = '" + req.body.jobid + "';";

    var query = baseClient.query(queryString);
    res.json('removed');
});

app.post('/removestudentjobinterest', function (req, res) {
    console.log('removestudentjobinterest:' + req.body.username);
    insertFeed(req.body.username, 'removed a job interest');

    var rows = [];
    var queryString = "DELETE FROM student_job_interest WHERE " + 
    "studentid = '" + req.body.username + "' AND " +  
    "jobid = '" + req.body.jobid + "';";

    var query = baseClient.query(queryString);
    res.json('removed');
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

//SELECT STUDENTS
app.post('/showstudents', function (req, res) {
    console.log('showstudents: parameters');
    
    var rows = [];
    //student info
    var display = req.body.gender == "all"?"(gender like '%')":"(gender = '" + req.body.gender + "')";
    display += " AND ";
    display += req.body.residentstatus == "all"?"(residentstatus like '%')":"(residentstatus = '" + req.body.residentstatus + "')";
    display += " AND ";
    display += req.body.country == "all"?"(country like '%')":"(country = '" + req.body.country + "')";
    display += " AND ";
    display += req.body.semesterregistered == "all"?"(semesterregistered like '%')":"(semesterregistered = '" + req.body.semesterregistered + "')";
    display += " AND ";
    display += req.body.internshipstatus == "all"?"(internshipstatus like '%')":"(internshipstatus = '" + req.body.internshipstatus + "')";

    //job
    var hired = "(student_job_achieved.jobid is NOT NULL OR student_job_achieved.jobid is NULL)";
    if(req.body.hired == "true"){
        hired = "(student_job_achieved.jobid is NOT NULL)";
    }else if(req.body.hired == "false"){
        hired = "(student_job_achieved.jobid is NULL)";
    }

    //salary
    var salary = req.body.salary == "all"?"(salary is NOT NULL OR salary is NULL)":"(cast(salary as int) " + req.body.salary + ")";

    var queryString = "SELECT distinct on (username) * " + 
    "FROM login inner join student on login.username = student.studentid left join " + 
    " student_job_achieved on student.studentid = student_job_achieved.studentid " +
    "left join job on cast(student_job_achieved.jobid as int) = job.id where " + display + 
    " and " + hired + 
    " and " + salary;

    // res.json(queryString);
    var query = baseClient.query(queryString);
    query.on('row', function(row) {
        rows.push(row);
    });
    query.on('end', function(result) {
        console.log('showstudents: ' + result.rowCount + ' rows');
        // console.log(rows);
        res.json(rows);
    });
});

