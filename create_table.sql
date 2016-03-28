create table login (
id SERIAL PRIMARY KEY,
username varchar[100],	
password varchar[100],
photoid	varchar[100],
type varchar[100]
);

create table internship (
id SERIAL PRIMARY KEY,
type varchar[100],
companyname varchar[100],
address varchar[100],
city varchar[100],
postalcode varchar[100],
country varchar[100],
contactpersonfirstname varchar[100],
contactpersonlastname varchar[100],
contactpersonposition varchar[100],
telephone varchar[100],
email varchar[100],
companywebsite varchar[100],
notes varchar[100]);

create table student (
id SERIAL PRIMARY KEY,
studentid varchar[100],
firstname varchar[100],
middlename varchar[100],
lastname varchar[100],
email varchar[100],
telephone varchar[100],
gender varchar[100],
residentstatus varchar[100],
internshipstatus varchar[100]);

create table student_internship (
id SERIAL PRIMARY KEY,
studentid varchar[100],
internshipid varchar[100]);


create table job (
id SERIAL PRIMARY KEY,
companyid varchar[100],
position varchar[100],
desc varchar[100],
responsibilities varchar[100],
requirements varchar[100],
salary varchar[100],
availability varchar[100]);

create table company (
id SERIAL PRIMARY KEY,
companyname varchar[100]);

create table student_job_achieved (
id SERIAL PRIMARY KEY,
studentid varchar[100],
jobid varchar[100]);

create table student_job_interest (
id SERIAL PRIMARY KEY,
studentid varchar[100],
jobid varchar[100]);

create table semesterregistered (
id SERIAL PRIMARY KEY,
studentid varchar[100],
semester varchar[100],
year varchar[100]);

create table education (
id SERIAL PRIMARY KEY,
studentid varchar[100],
degreetype varchar[100],
major varchar[100],
gpa varchar[100],
university varchar[100],
location varchar[100],
certifications varchar[100]);

create table workexperience (
id SERIAL PRIMARY KEY,
studentid varchar[100],
company varchar[100],
location varchar[100],
startdate timestamp,
enddate timestamp,
position varchar[100]);

create table skill (
id SERIAL PRIMARY KEY,
studentid varchar[100],
type varchar[100],
value varchar[100]);
