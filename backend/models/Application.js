const pool = require('../config/mysql');

class Application {
  static async create({ postId, studentId, status = 'pending' }) {
    const [result] = await pool.query(
      `INSERT INTO APPLICATIONS (postId, studentId, status)
       VALUES (?, ?, ?)`,
      [postId, studentId, status]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT a.*, s.name AS studentName, s.email AS studentEmail, s.city AS studentCity,
              p.title AS postTitle, p.userId AS businessId
       FROM APPLICATIONS a
       JOIN USERS s ON s.id = a.studentId
       JOIN POSTS p ON p.id = a.postId
       WHERE a.id = ?`,
      [id]
    );

    return rows[0] ? this.toPublicApplication(rows[0]) : null;
  }

  static async findForStudent(studentId) {
    const [rows] = await pool.query(
      `SELECT a.*, s.name AS studentName, s.email AS studentEmail, s.city AS studentCity,
              p.title AS postTitle, p.userId AS businessId
       FROM APPLICATIONS a
       JOIN USERS s ON s.id = a.studentId
       JOIN POSTS p ON p.id = a.postId
       WHERE a.studentId = ?
       ORDER BY a.applied_at DESC`,
      [studentId]
    );

    return rows.map(this.toPublicApplication);
  }

  static async findForPost(postId) {
    const [rows] = await pool.query(
      `SELECT a.*, s.name AS studentName, s.email AS studentEmail, s.city AS studentCity,
              p.title AS postTitle, p.userId AS businessId
       FROM APPLICATIONS a
       JOIN USERS s ON s.id = a.studentId
       JOIN POSTS p ON p.id = a.postId
       WHERE a.postId = ?
       ORDER BY a.applied_at DESC`,
      [postId]
    );

    return rows.map(this.toPublicApplication);
  }

  static async findExisting({ postId, studentId }) {
    const [rows] = await pool.query(
      'SELECT * FROM APPLICATIONS WHERE postId = ? AND studentId = ?',
      [postId, studentId]
    );

    return rows[0] || null;
  }

  static async updateStatus({ id, status }) {
    await pool.query('UPDATE APPLICATIONS SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }

  static toPublicApplication(row) {
    return {
      id: row.id,
      postId: row.postId,
      studentId: row.studentId,
      status: row.status,
      appliedAt: row.applied_at,
      post: {
        id: row.postId,
        title: row.postTitle,
        businessId: row.businessId
      },
      student: {
        id: row.studentId,
        name: row.studentName,
        email: row.studentEmail,
        city: row.studentCity
      }
    };
  }
}

module.exports = Application;
