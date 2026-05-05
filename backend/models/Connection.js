const pool = require('../config/mysql');

class Connection {
  static async create({ businessId, studentId, message = '' }) {
    await pool.query(
      `INSERT INTO CONNECTIONS (businessId, studentId, message, status)
       VALUES (?, ?, ?, 'pending')
       ON DUPLICATE KEY UPDATE
         message = VALUES(message),
         status = 'pending',
         updated_at = CURRENT_TIMESTAMP`,
      [businessId, studentId, message]
    );

    return this.findExisting({ businessId, studentId });
  }

  static async findById(id) {
    const [rows] = await pool.query(this.baseQuery('WHERE c.id = ?'), [id]);
    return rows[0] ? this.toPublicConnection(rows[0]) : null;
  }

  static async findExisting({ businessId, studentId }) {
    const [rows] = await pool.query(
      this.baseQuery('WHERE c.businessId = ? AND c.studentId = ?'),
      [businessId, studentId]
    );
    return rows[0] ? this.toPublicConnection(rows[0]) : null;
  }

  static async findForBusiness(businessId) {
    const [rows] = await pool.query(
      this.baseQuery('WHERE c.businessId = ? ORDER BY c.updated_at DESC'),
      [businessId]
    );
    return rows.map(this.toPublicConnection);
  }

  static async findForStudent(studentId) {
    const [rows] = await pool.query(
      this.baseQuery('WHERE c.studentId = ? ORDER BY c.updated_at DESC'),
      [studentId]
    );
    return rows.map(this.toPublicConnection);
  }

  static async updateStatus({ id, studentId, status }) {
    await pool.query(
      `UPDATE CONNECTIONS
       SET status = ?
       WHERE id = ? AND studentId = ?`,
      [status, id, studentId]
    );
    return this.findById(id);
  }

  static baseQuery(whereClause) {
    return `
      SELECT c.*,
             b.name AS businessName,
             b.email AS businessEmail,
             b.city AS businessCity,
             b.profilePhoto AS businessPhoto,
             b.profileData AS businessProfileData,
             s.name AS studentName,
             s.email AS studentEmail,
             s.city AS studentCity,
             s.skills AS studentSkills,
             s.profilePhoto AS studentPhoto
      FROM CONNECTIONS c
      JOIN USERS b ON b.id = c.businessId
      JOIN USERS s ON s.id = c.studentId
      ${whereClause}
    `;
  }

  static parseJson(value, fallback) {
    if (!value) return fallback;
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  static toPublicConnection(row) {
    const businessProfileData = Connection.parseJson(row.businessProfileData, {});

    return {
      id: row.id,
      businessId: row.businessId,
      studentId: row.studentId,
      message: row.message || '',
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      business: {
        id: row.businessId,
        name: businessProfileData.businessName || businessProfileData.shopName || row.businessName,
        email: row.businessEmail,
        city: row.businessCity || '',
        category: businessProfileData.category || businessProfileData.businessCategory || businessProfileData.industry || '',
        profilePhoto: row.businessPhoto || ''
      },
      student: {
        id: row.studentId,
        name: row.studentName,
        email: row.studentEmail,
        city: row.studentCity || '',
        skills: Connection.parseJson(row.studentSkills, []),
        profilePhoto: row.studentPhoto || ''
      }
    };
  }
}

module.exports = Connection;
