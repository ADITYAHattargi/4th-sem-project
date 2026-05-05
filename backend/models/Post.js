const pool = require('../config/mysql');

class Post {
  static async create({ userId, title, description, imageUrl, jobType, location, stipend }) {
    const [result] = await pool.query(
      `INSERT INTO POSTS (userId, title, description, imageUrl, jobType, location, stipend)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description || '', imageUrl || '', jobType || '', location || '', stipend || '']
    );

    return this.findById(result.insertId);
  }

  static async findAll({ page = 1, limit = 20, role, userId } = {}) {
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (pageNum - 1) * limitNum;
    const values = [];

    const whereParts = [];
    if (role) {
      whereParts.push('u.role = ?');
      values.push(role);
    }
    if (userId) {
      whereParts.push('p.userId = ?');
      values.push(userId);
    }

    const where = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    values.push(limitNum, offset);

    const [rows] = await pool.query(
      `SELECT p.*, u.name AS userName, u.role AS userRole, u.city AS userCity, u.profilePhoto AS userPhoto
       FROM POSTS p
       JOIN USERS u ON u.id = p.userId
       ${where}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      values
    );

    return rows.map(this.toPublicPost);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, u.name AS userName, u.role AS userRole, u.city AS userCity, u.profilePhoto AS userPhoto
       FROM POSTS p
       JOIN USERS u ON u.id = p.userId
       WHERE p.id = ?`,
      [id]
    );

    return rows[0] ? this.toPublicPost(rows[0]) : null;
  }

  static toPublicPost(row) {
    return {
      id: row.id,
      userId: row.userId,
      title: row.title,
      description: row.description,
      imageUrl: row.imageUrl,
      jobType: row.jobType,
      location: row.location,
      stipend: row.stipend,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      user: {
        id: row.userId,
        name: row.userName,
        role: row.userRole,
        city: row.userCity,
        profilePhoto: row.userPhoto
      }
    };
  }
}

module.exports = Post;
