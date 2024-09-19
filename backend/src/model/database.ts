import mysql from 'mysql2/promise';

export async function connect() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.HOST_DATABASE || 'localhost',
            user: process.env.USER_DATABASE || 'root',
            database: process.env.NAME_DATABASE || 'test',
            port: parseInt(process.env.PORT_DATABASE || '3306'),
            password: process.env.PASSWORD_DATABASE || '',
        });
        console.log('Database connected');
        
        
        const closeConnection = async () => {
            await connection.end();
            console.log('Database connection closed');
        };

        return { connection, closeConnection };
    } catch (err) {
        console.log(err);
    }
}
