const pool = require('./mysql');

const databaseName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'career_app';
const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
const isLocalDatabase = !process.env.MYSQL_URL &&
  !process.env.DATABASE_URL &&
  localHosts.has(process.env.DB_HOST || process.env.MYSQLHOST || 'localhost');

const escapeIdentifier = (identifier) => `\`${String(identifier).replace(/`/g, '``')}\``;

// MySQL connection test function
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected: Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    throw error;
  }
};

// Initialize database tables
const initDB = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Local setup can create the default database. Hosted MySQL providers usually
    // give one database and may not allow CREATE DATABASE.
    if (isLocalDatabase) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(databaseName)}`);
    }
    await connection.query(`USE ${escapeIdentifier(databaseName)}`);
    
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
        profilePhoto LONGTEXT,
        profileData LONGTEXT,
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
        imageUrl LONGTEXT,
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

    await connection.query(`
      CREATE TABLE IF NOT EXISTS CONNECTIONS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        businessId INT NOT NULL,
        studentId INT NOT NULL,
        message TEXT,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_business_student (businessId, studentId),
        FOREIGN KEY (businessId) REFERENCES USERS(id) ON DELETE CASCADE,
        FOREIGN KEY (studentId) REFERENCES USERS(id) ON DELETE CASCADE
      )
    `);

    await connection.query('ALTER TABLE USERS MODIFY profilePhoto LONGTEXT');
    await connection.query('ALTER TABLE USERS MODIFY profileData LONGTEXT');
    await connection.query('ALTER TABLE POSTS MODIFY imageUrl LONGTEXT');
    
    console.log('✅ Database tables initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = { connectDB, initDB };

