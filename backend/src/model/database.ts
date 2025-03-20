import { Pool } from 'pg';

export async function connect() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        // host: process.env.HOST_DATABASE,
        // user: process.env.USER_DATABASE,
        // database: process.env.NAME_DATABASE,
        // port: parseInt(process.env.PORT_DATABASE || '5432'),
        // password: process.env.PASSWORD_DATABASE,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        const connection = await pool.connect();
        console.log('PostgreSQL connected');
        
        const closeConnection = async () => {
            await connection.release();
            console.log('PostgreSQL connection closed');
        };

        return { connection, closeConnection, pool };
    } catch (err) {
        console.log('PostgreSQL connection error:', err);
        throw err;
    }
}