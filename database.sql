CREATE DATABASE cars;
CREATE TABLE carstreat(
  treatment_number SERIAL PRIMARY KEY,
  treatment_information VARCHAR(255),
  date VARCHAR(255),
  worker_email VARCHAR(255),
  car_number INTEGER
);