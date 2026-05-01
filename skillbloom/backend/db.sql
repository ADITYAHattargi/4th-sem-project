CREATE DATABASE IF NOT EXISTS career_app;
USE career_app;

CREATE TABLE IF NOT EXISTS USERS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'business') NOT NULL,
  skills TEXT,
  location VARCHAR(255),
  profilePhoto VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO USERS (name, email, password, role, skills, location, profilePhoto) VALUES 
('Test Student', 'test@student.com', '$2a$12$test_hash_here', 'student', '["Content Creation", "Social Media"]', 'Mumbai', 'https://i.pravatar.cc/150')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

