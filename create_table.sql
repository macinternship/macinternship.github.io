create table login (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
username CHAR(100),	
password CHAR(100),
photoid CHAR(100),
type CHAR(100));

create table internship (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
type CHAR(100),
companyname CHAR(100),
address CHAR(100),
city CHAR(100),
postalcode CHAR(100),
country CHAR(100),
contactpersonfirstname CHAR(100),
contactpersonlastname CHAR(100),
contactpersonposition CHAR(100),
telephone CHAR(100),
email CHAR(100),
companywebsite CHAR(100),
notes CHAR(100));

create table student (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
studentid CHAR(100),
firstname CHAR(100),
middlename CHAR(100),
lastname CHAR(100),
email CHAR(100),
telephone CHAR(100),
gender CHAR(100),
residentstatus CHAR(100),
internshipstatus CHAR(100));

create table student_internship (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
studentid CHAR(100),
internshipid CHAR(100));

create table job (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
companyid CHAR(100),
position CHAR(100),
description CHAR(100),
responsibilities CHAR(100),
requirements CHAR(100),
salary CHAR(100),
availability CHAR(100));

create table company (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
companyname CHAR(100));

create table student_job_achieved (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
studentid CHAR(100),
jobid CHAR(100));

create table student_job_interest (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
studentid CHAR(100),
jobid CHAR(100));

create table semesterregistered (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
studentid CHAR(100),
semester CHAR(100),
year CHAR(100));

create table education (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
studentid CHAR(100),
degreetype CHAR(100),
major CHAR(100),
gpa CHAR(100),
university CHAR(100),
location CHAR(100),
certifications CHAR(100));

create table workexperience (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
studentid CHAR(100),
company CHAR(100),
location CHAR(100),
startdate timestamp,
enddate timestamp,
position CHAR(100));

create table skill (
id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
studentid CHAR(100),
type CHAR(100),
value CHAR(100));
