const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.full_name = data.full_name;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Create a new user
    static async create(userData) {
        const { username, email, password, full_name } = userData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        try {
            const [result] = await connection.execute(
                'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, full_name]
            );
            await connection.end();
            return new User({ id: result.insertId, username, email, password: hashedPassword, full_name });
        } catch (error) {
            await connection.end();
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        try {
            const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            await connection.end();
            if (rows.length > 0) {
                return new User(rows[0]);
            }
            return null;
        } catch (error) {
            await connection.end();
            throw error;
        }
    }

    // Find user by username
    static async findByUsername(username) {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        try {
            const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
            await connection.end();
            if (rows.length > 0) {
                return new User(rows[0]);
            }
            return null;
        } catch (error) {
            await connection.end();
            throw error;
        }
    }

    // Validate password
    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    // To JSON (exclude password)
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            full_name: this.full_name,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = User;