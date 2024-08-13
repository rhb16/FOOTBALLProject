import dotenv from 'dotenv';

dotenv.config();

interface DbConfig {
    host: string;   
    user: string;     
    password: string; 
    database: string; 
}

const dbConfig: DbConfig = {
    host: process.env.DB_HOST as string,         
    user: process.env.DB_USER as string,         
    password: process.env.DB_PASSWORD as string, 
    database: process.env.DB_NAME as string      
};

export default dbConfig;
