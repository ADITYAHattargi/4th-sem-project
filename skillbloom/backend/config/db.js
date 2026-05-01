const pool = require('./mysql');

// MySQL connection test function
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected: Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initDB = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create database if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS career_app');
    await connection.query('USE career_app');
    
    // Create USERS table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS USERS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'business') NOT NULL,
        skills TEXT,
        city VARCHAR(255),
        profilePhoto VARCHAR(500),
        profileData TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create POSTS table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS POSTS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        imageUrl VARCHAR(500),
        jobType VARCHAR(100),
        location VARCHAR(255),
        stipend VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES USERS(id) ON DELETE CASCADE
      )
    `);
    
    // Create APPLICATIONS table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS APPLICATIONS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        postId INT NOT NULL,
        studentId INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES POSTS(id) ON DELETE CASCADE,
        FOREIGN KEY (studentId) REFERENCES USERS(id) ON DELETE CASCADE
      )
    `);
    
    console.log('✅ Database tables initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, initDB };

