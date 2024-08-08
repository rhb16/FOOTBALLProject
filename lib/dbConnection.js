const mysql = require("mysql2/promise");

const getConnection = async () => {
  try {
    // Database connection
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_PORT,
      insecureAuth: true,
    });

    return db;
  } catch (e) {
    console.error(e);
    return null;
  }
};

module.exports = getConnection;
