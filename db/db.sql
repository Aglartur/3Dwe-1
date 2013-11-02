/* -------------------------------------------------------------- */
/* 3Dwe SQL Tables                                           */
/* on PostgresSQL                                                      */
/* This file creates tables of 3Dwe project database.          */
/* ---------------------------------------------------------------*/

drop table if exists account cascade;
drop table if exists books cascade;
drop table if exists bookshelf cascade;
drop table if exists photos cascade;
drop table if exists photo_album cascade;
drop table if exists audios cascade;
drop table if exists jukebox cascade;
drop table if exists videos cascade;
drop table if exists tv cascade;

create table account
	(	acc_id		SERIAL,
	    email		varchar(50)	not null,
		fname		varchar(50)	not null,	
		lname		varchar(50)	not null,
		password	varchar(25) not null,
		primary key(acc_id)
	);

create table books
	(	bid					SERIAL,
		book_name			varchar(50)	not null,	
		book_description	varchar(100),
		primary key(bid)
	);
	
create table bookshelf
	(	bid					int,
		acc_id				int,
		primary key(bid, acc_id),
		foreign key(bid) references books
			on delete cascade,
		foreign key(acc_id) references account
			on delete cascade
	);	
	
create table photos
	(	pid					SERIAL,
		photos_name			varchar(50) not null,	
		book_description	varchar(100),
		primary key(pid)
	);
	
create table photo_album
	(	pid					int,
		acc_id				int,
		primary key(pid, acc_id),
		foreign key(pid) references photos
			on delete cascade,
		foreign key(acc_id) references account
			on delete cascade
	);	

create table audios
	(	aid					SERIAL,
		audio_name			varchar(50)	not null,	
		audio_description	varchar(100),
		primary key(aid)
	);
	
create table jukebox
	(	aid					int,
		acc_id				int,
		primary key(aid, acc_id),
		foreign key(aid) references audios
			on delete cascade,
		foreign key(acc_id) references account
			on delete cascade
	);		
	
create table videos
	(	vid					SERIAL,
		video_name			varchar(50)	not null,	
		video_description	varchar(100),
		primary key(vid)
	);
	
create table tv
	(	vid					int,
		acc_id				int,
		primary key(vid, acc_id),
		foreign key(vid) references videos
			on delete cascade,
		foreign key(acc_id) references account
			on delete cascade
	);		
		
	