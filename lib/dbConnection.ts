import mysql, { Connection } from 'mysql2';
import dbConfig from './dbConfig';

const connection: Connection = mysql.createConnection(dbConfig);
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});
export default connection;