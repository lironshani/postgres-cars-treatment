CREATE DATABASE cars_treatments;
CREATE TABLE treatments(
  treatment_number SERIAL PRIMARY KEY,
  treatment_information VARCHAR(255),
  date VARCHAR(255),
  worker_email VARCHAR(255),
  car_number INTEGER
);
CREATE TABLE users (
	id VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);