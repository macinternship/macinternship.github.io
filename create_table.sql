create table login (
id SERIAL PRIMARY KEY,
username TEXT,	
password TEXT,
photoid	TEXT,
type TEXT
);

create table internship (
id SERIAL PRIMARY KEY,
type TEXT,
companyname TEXT,
address TEXT,
city TEXT,
postalcode TEXT,
country TEXT,
contactpersonfirstname TEXT,
contactpersonlastname TEXT,
contactpersonposition TEXT,
telephone TEXT,
email TEXT,
companywebsite TEXT,
notes TEXT);

create table student (
id SERIAL PRIMARY KEY,
studentid TEXT,
firstname TEXT,
middlename TEXT,
lastname TEXT,
email TEXT,
telephone TEXT,
gender TEXT,
residentstatus TEXT,
internshipstatus TEXT);

create table student_internship (
id SERIAL PRIMARY KEY,
studentid TEXT,
internshipid TEXT);


create table job (
id SERIAL PRIMARY KEY,
companyid TEXT,
position TEXT,
desc TEXT,
responsibilities TEXT,
requirements TEXT,
salary TEXT,
availability TEXT);

create table company (
id SERIAL PRIMARY KEY,
companyname TEXT);

create table student_job_achieved (
id SERIAL PRIMARY KEY,
studentid TEXT,
jobid TEXT);

create table student_job_interest (
id SERIAL PRIMARY KEY,
studentid TEXT,
jobid TEXT);

create table semesterregistered (
id SERIAL PRIMARY KEY,
studentid TEXT,
semester TEXT,
year TEXT);

create table education (
id SERIAL PRIMARY KEY,
studentid TEXT,
degreetype TEXT,
major TEXT,
gpa TEXT,
university TEXT,
location TEXT,
certifications TEXT);

create table workexperience (
id SERIAL PRIMARY KEY,
studentid TEXT,
company TEXT,
location TEXT,
startdate timestamp,
enddate timestamp,
position TEXT);

create table skill (
id SERIAL PRIMARY KEY,
studentid TEXT,
type TEXT,
value TEXT,
levelOfKnowledge TEXT);

create table feed(
id SERIAL PRIMARY KEY,
studentid TEXT,
value TEXT,
datetime timestamp
);