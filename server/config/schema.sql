CREATE DATABASE data_pulse;
USE data_pulse;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    pw VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE notes (
    id integer PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(250) NOT NULL,
    note VARCHAR(250) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

