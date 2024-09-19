use temp6;


create table formTemplate   (
	formTemplateId int identity(1,1) primary key,
	fieldName varchar(50) not null,
	actualName varchar(50) not null,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	formTemplate int not null
) 

create table formTable (
	formId int identity(1,1) primary key,
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	formTemplate int not null,

)

create table formTableModHistory (
	formTableModHistoryId int identity(1,1) primary key,
	modifiedBy int not null,
	modifiedAt datetime default CURRENT_TIMESTAMP,
	modifiedForm int not null,
	constraint fkModifiedBy foreign key (modifiedBy) references formTable(formId),
	constraint fkModifiedStudent foreign key (modifiedForm) references formTable(formId),
)

create table formTableModifiedFields(
	id int identity(1,1) primary key,
	formTableModHistoryId int not null,
	fieldName varchar(50) not null,
	fieldPrevValue varchar(max) not null,
	fieldNewValue varchar(max) not null,
	constraint fkFormTableModHistoryId foreign key (formTableModHistoryId) references formTableModHistory(formTableModHistoryId)
)


create table formTemplateModHistory (
	formTemplateModHistoryId int identity(1,1) primary key,
	modifiedBy int not null,
	modifiedAt datetime default CURRENT_TIMESTAMP,
	modifiedFormTemplateId int not null,
	constraint fkFormTemplateModifiedBy foreign key (modifiedBy) references formTable(formId),
	constraint fkModifiedFormTemplate foreign key (modifiedFormTemplateId) references formTemplate(formTemplateId),
)

create table formTemplateModifiedFields(
	id int identity(1,1) primary key,
	formTemplateModHistoryId int not null,
	fieldName varchar(50) not null,
	fieldPrevValue varchar(max) not null,
	fieldNewValue varchar(max) not null,
	constraint fkFormTemplateModHistoryId foreign key (formTemplateModHistoryId) references formTemplateModHistory(formTemplateModHistoryId)
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
	createdAt datetime default current_timestamp,
	deletedAt datetime,
	constraint fkFormDataFormTable foreign key (formId) references formTable(formId)
)

create table formDataModHistory (
	formDataModHistoryId int identity(1,1) primary key,
	modifiedBy int not null,
	modifiedAt datetime default CURRENT_TIMESTAMP,
	modifiedFormDataId int not null,
	constraint fkFormDataModifiedBy foreign key (modifiedBy) references formTable(formId),
	constraint fkFormDataModifiedFormTemplate foreign key (modifiedFormDataId) references formData(formDataId),
)

create table formDataModifiedFields(
	formDataModifiedFieldsId int identity(1,1) primary key,
	formDataModHistoryId int not null,
	fieldName varchar(50) not null,
	fieldPrevValue varchar(max) not null,
	fieldNewValue varchar(max) not null,
	constraint fkFormDataModHistory foreign key (formDataModHistoryId) references formDataModHistory(formDataModHistoryId)
)


create table formFiles (
	formFileId int identity(1,1) primary key,
	fileName varchar(50) not null,
	fileType varchar(10) not null,
	fileData varchar(max) not null,
	formId int not null,
	constraint fkFormTableFormFiles foreign key (formId) references formTable(formId)
)


alter table formFiles add createdAt datetime default current_timestamp
alter table formFiles add deletedAt datetime

create table formFilesModHistory (
	formFilesModHistoryId int identity(1,1) primary key,
	modifiedBy int not null,
	modifiedAt datetime default CURRENT_TIMESTAMP,
	modifiedFormFilesId int not null,
	constraint fkFormFilesModifiedBy foreign key (modifiedBy) references formTable(formId),
	constraint fkFormFilesModifiedFormTemplate foreign key (modifiedFormFilesId) references formFiles(formFileId),
)

create table formFilesModifiedFields (
	formFilesModifiedFieldsId int identity(1,1) primary key,
	formFilesModHistoryId int not null,
	fieldName varchar(50) not null,
	fieldPrevValue varchar(max) not null,
	fieldNewValue varchar(max) not null,
	constraint fkFormFilesModHistory foreign key (formFilesModHistoryId) references formFilesModHistory(formFilesModHistoryId)
)


use temp6;

insert into formTemplate(fieldName,actualName,formTemplate) 
values('charField1','firstName',1),
('charField2','lastName',1),
 ('charField3','gender',1),
 ('charField4','email',1),
('charField5','phone',1),
 ('dateField1','dob',1),
('numberField1','faculty',1),
 ('dateField2','joinedOn',1),
 ('numberField2','rollNo',1),
 ('numberField3','currentYear',1),
 ('charField6','address',1),
 ('charField7','country',1),
 ('charField8','city',1);


 insert into formTemplate(fieldName,actualName,formTemplate)
 values('charField1','firstName',2),
('charField2','lastName',2),
 ('charField3','gender',2),
 ('charField4','email',2),
('charField5','phone',2),
 ('dateField1','dob',2),
 ('charField6','address',2),
 ('charField7','username',2),
 ('charField8','password',2);

 select * from formTemplate where formTemplate=2;
 update formTemplate set formTemplate=2 where formTemplateId = 18;

 update formTemplate set fieldName='numberField1' where formTemplate=1 and actualName='faculty'
insert into  formData(charField1,charField2,charField3,charField4,charField5,dateField1,numberField1,dateField2,numberField2,numberField3,charField6,
charField7,charField8,formId) values('meow','meow','male','meow@meow.meow','123123123','2002-12-01',2,'2024-09-19',1,3,'asefasdf asdfas','Nepal','Bhaktapur',1)


insert into formTemplate(fieldName,actualName,formTemplate) 
	values('charField1','name',3),
	('numberField1','totalNumberOfYear',3),
	('numberField2','totalNumberOfSemester',3),
	('charField2','abbr',3);


	select fieldName,actualName from formtemplate where formTemplate=1;

	select * from formData;

insert into  formTable(formTemplate) values(1);
insert into  formTable(formTemplate) values(3);
insert into  formTable(formTemplate) values(3);

select charField1,charField2,charField3,charField4,charField5,dateField1,numberField1,dateField2
,numberField2,numberField3,charField6,charField7,charField8,formId from formData where formId=1

select*from formTable;

insert into formData(charField1,numberField1,numberField2,charField2,formId) values('Bachelor of Computer Application',4,8,'BCA',2)
insert into formData(charField1,numberField1,numberField2,charField2,formId) values('Bachelor of Science in Computer Science',4,8,'BSc. csit',3)

select * from formData;

select top 1 * from formTable order by createdAt desc;


select * from formTable where formId = 6;


update formTable set deletedAt='2024-09-19' where formId=6

update formData set deletedAt='2024-09-19' where formId=6

update formFiles set deletedAt='2024-09-19' where formId=6




select * from formTemplate where formTemplate=1;
update formData set charField1='Bigg' where formId=1;

select * from formData;
insert into formDataModHistory(modifiedBy,modifiedAt,modifiedFormDataId) values(1,'2024-09-19',6);
select * from formDataModHistory;
insert into formDataModifiedFields(formDataModHistoryId,fieldName,fieldPrevValue,fieldNewValue) values(5,'charField1','meow','Bigg');
select * from formDataModifiedFields;