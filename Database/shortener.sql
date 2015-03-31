DROP DATABASE IF EXISTS shortener;

CREATE DATABASE shortener;

USE shortener;

CREATE TABLE linkki (
	lyhennetty VARCHAR(60) PRIMARY KEY,
	alkuperainen VARCHAR(600) NOT NULL
)ENGINE=InnoDB;