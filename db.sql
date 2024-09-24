create database temp11;
use temp11
create table users (
	userId int identity(1,1) primary key,
	firstName varchar(50) not null,
	lastName varchar(50) not null,
	gender varchar(7) not null,
	email varchar(50) not null,
	phone varchar(50) not null,
	dob date not null,
	address varchar(50) not null,
	username varchar(50) not null,
	password varchar(200) not null,
	avatar varchar(max) not null
)

create table formTemplate   (
	formTemplateId int identity(1,1) primary key,
	fieldName varchar(50) not null,
	actualName varchar(50) not null,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	formTemplate int not null,
	createdBy int,
	deletedBy int 
	constraint fkFormTemplateCreatedBy foreign key (createdBy) references users(userId),
	constraint fkFormTemplateDeletedBy foreign key (deletedBy) references users(userId)
) 

create table formTemplateModifiedHistory   (
	formTemplateModifiedHistoryId int identity(1,1) primary key,
	fieldName varchar(50) not null,
	actualName varchar(50) not null,
	formTemplate int not null,
	
	formTemplateId int not null,
	type varchar(50) not null,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	createdBy int,
	deletedBy int,
	constraint fkFormTemplateModifiedHistoryFormTable foreign key (formTemplateId) references formTemplate(formTemplateId),
	constraint fkFormTemplateModifiedHistoryCreatedBy foreign key (createdBy) references users(userId),
	constraint fkFormTemplateModifiedHistoryDeletedBy foreign key (deletedBy) references users(userId)
) 

create table formTable (
	formId int identity(1,1) primary key,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	formTemplate int not null,
	createdBy int,
	deletedBy int,
	constraint fkFormTableCreatedBy foreign key (createdBy) references users(userId),
	constraint fkFormTableDeletedBy foreign key (deletedBy) references users(userId)
)

create table formTableModifiedHistory (
	formTableModifiedHistoryId int identity(1,1) primary key,
	formTemplate int not null,

	formId int not null,
	type varchar(50) not null,
	createdBy int,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	deletedBy int,
	constraint fkFormTableModifiedHistoryFormTable foreign key (formId) references formTable(formId),
	constraint fkFormTableModifiedHistoryCreatedBy foreign key (createdBy) references users(userId),
	constraint fkFormTableModifiedHistoryDeletedBy foreign key (deletedBy) references users(userId)
)


create table formData (
	formDataId int identity(1,1) primary key,
	charField1 varchar(50),
	charField2 varchar(50),
	charField3 varchar(50),
	charField4 varchar(50),
	charField5 varchar(50),
	charField6 varchar(50),
	charField7 varchar(50),
	charField8 varchar(50),
	charField9 varchar(50),
	charField10 varchar(50),
	charField11 varchar(50),
	charField12 varchar(50),
	charField13 varchar(50),
	dateField1 date,
	dateField2 date,
	dateField3 date,
	dateField4 date,
	dateTimeField1 datetime,
	dateTimeField2 datetime,
	dateTimeField3 datetime,
	numberField1 int,
	numberField2 int,
	numberField3 int,
	numberField4 int,
	numberField5 int,
	numberField6 int,
	floatField1 float,
	floatField2 float,
	floatField3 float,
	floatField4 float,
	floatField5 float,
	formId int not null,
	constraint fkFormDataFormTable foreign key (formId) references formTable(formId),
	createdBy int,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	deletedBy int
	constraint fkFormDataCreatedBy foreign key (createdBy) references users(userId),
	constraint fkFormDataDeletedBy foreign key (deletedBy) references users(userId)
)

create table formDataModifiedHistory (
	formDataModifiedHistoryId int identity(1,1) primary key,
	charField1 varchar(50),
	charField2 varchar(50),
	charField3 varchar(50),
	charField4 varchar(50),
	charField5 varchar(50),
	charField6 varchar(50),
	charField7 varchar(50),
	charField8 varchar(50),
	charField9 varchar(50),
	charField10 varchar(50),
	charField11 varchar(50),
	charField12 varchar(50),
	charField13 varchar(50),
	dateField1 date,
	dateField2 date,
	dateField3 date,
	dateField4 date,
	dateTimeField1 datetime,
	dateTimeField2 datetime,
	dateTimeField3 datetime,
	numberField1 int,
	numberField2 int,
	numberField3 int,
	numberField4 int,
	numberField5 int,
	numberField6 int,
	floatField1 float,
	floatField2 float,
	floatField3 float,
	floatField4 float,
	floatField5 float,

	formDataId int not null,
	type varchar(20) not null,
	createdBy int,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	deletedBy int,
	constraint fkFormDataModifiedHistoryFormTable foreign key (formDataId) references formData(formDataId),
	constraint fkFormDataModifiedHistoryCreatedBy foreign key (createdBy) references users(userId),
	constraint fkFormDataModifiedHistoryDeletedBy foreign key (deletedBy) references users(userId)
)


create table formFiles (
	formFileId int identity(1,1) primary key,
	fileName varchar(50) not null,
	fileType varchar(10) not null,
	fileData varchar(max) not null,
	formId int not null,
	constraint fkFormTableFormFiles foreign key (formId) references formTable(formId),
	createdBy int,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	deletedBy int,
	constraint fkFormFilesCreatedBy foreign key (createdBy) references users(userId),
	constraint fkFormFilesDeletedBy foreign key (deletedBy) references users(userId)
)

create table formFilesModifiedHistory (
	formFileId int identity(1,1) primary key,
	fileName varchar(50) not null,
	fileType varchar(10) not null,
	fileData varchar(max) not null,
	formFilesId int not null,
	type varchar(20) not null,
	constraint fkformFilesModifiedHistoryFormFiles foreign key (formFilesId) references formFiles(formFileId),
	createdBy int,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	deletedBy int,
	constraint fkFormFilesModifiedHistoryCreatedBy foreign key (createdBy) references users(userId),
	constraint fkFormFilesModifiedHistoryDeletedBy foreign key (deletedBy) references users(userId)
)



drop table usersModifiedHistory;

create table usersModifiedHistory  (
	userModifiedHistoryId int identity(1,1) primary key,
	firstName varchar(50),
	lastName varchar(50),
	gender varchar(7),
	email varchar(50),
	phone varchar(50),
	dob date,
	address varchar(50),
	username varchar(50),
	password varchar(200),
	avatar varchar(max),
	userId int not null,
	constraint fkUsersModifiedHistoryUserId foreign key (userId) references users(userId),

	modifiedAt datetime default current_timestamp,
)

alter table users  add roles varchar(20) default 'viewer';

update users set roles='editor' where userId=4;

select * from users;
insert into formTable(formTemplate) OUTPUT Inserted.formId values(1)

select*from formData;
select * from formDataModifiedHistory where formDataId=15

use temp11;
select  username,roles from users;