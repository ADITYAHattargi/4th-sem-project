const pool = require('../config/mysql');
const bcrypt = require('bcryptjs');

// User Model for MySQL
class User {
  // Create new user
  static async create({ name, email, password, role, skills, city, photoUrl, profileData }) {
    const connection = await pool.getConnection();
    try {
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Parse skills to JSON string
      const skillsJson = skills ? JSON.stringify(skills) : null;
      const profileDataJson = profileData ? JSON.stringify(profileData) : null;
      
      const [result] = await connection.query(
        `INSERT INTO USERS (name, email, password, role, skills, city, profilePhoto, profileData) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, role, skillsJson, city, photoUrl || 'https://i.pravatar.cc/150', profileDataJson]
      );
      
      connection.release();
      return {
        id: result.insertId,
        name,
        email,
        role,
        skills: skillsJson,
        city,
        profilePhoto: photoUrl || 'https://i.pravatar.cc/150',
        profileData: profileDataJson
      };
    } catch (error) {
      connection.release();
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM USERS WHERE email = ?',
        [email]
      );
      connection.release();
      return rows[0] || null;
    } catch (error) {
      connection.release();
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM USERS WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0] || null;
    } catch (error) {
      connection.release();
      throw error;
    }
  }

  // Compare password
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Update user profile
  static async updateProfile(id, updateData) {
    const connection = await pool.getConnection();
    try {
      const fields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined) {
          fields.push(`${key} = ?`);
          // Convert arrays to JSON string
          const formattedValue = Array.isArray(value) ? JSON.stringify(value) : value;
          values.push(formattedValue);
        }
      }
      
      if (fields.length === 0) {
        connection.release();
        return null;
      }
      
      values.push(id);
      
      const [result] = await connection.query(
        `UPDATE USERS SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      connection.release();
      return result.affectedRows > 0 ? this.findById(id) : null;
    } catch (error) {
      connection.release();
      throw error;
    }
  }

  // Get all users
  static async findAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM USERS');
      connection.release();
      return rows;
    } catch (error) {
      connection.release();
      throw error;
    }
  }

  // Get all students
  static async findAllStudents() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM USERS WHERE role = 'student'"
      );
      connection.release();
      return rows;
    } catch (error) {
      connection.release();
      throw error;
    }
  }

  // Get all businesses
  static async findAllBusinesses() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM USERS WHERE role = 'business'"
      );
      connection.release();
      return rows;
    } catch (error) {
      connection.release();
      throw error;
    }
  }
}

module.exports = User;
