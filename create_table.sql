create table login (
id SERIAL PRIMARY KEY,
username TEXT,	
password TEXT,
photoid	TEXT,
type TEXT
);

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
country TEXT,
semesterregistered TEXT,
internshipstatus TEXT);

create table internship (
id SERIAL PRIMARY KEY,
studentid TEXT,
type TEXT,
companyid TEXT,
notes TEXT);

create table job (
id SERIAL PRIMARY KEY,
companyid TEXT,
position TEXT,
description TEXT,
responsibilities TEXT,
requirements TEXT,
salary TEXT,
availability TEXT);

create table company (
id SERIAL PRIMARY KEY,
photoid	TEXT,
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
companywebsite TEXT);

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
companyid TEXT,
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

insert into semesterregistered (semester, year) values ('fall', '2015');
insert into semesterregistered (semester, year) values ('winter', '2016');