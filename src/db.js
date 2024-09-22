import pg from 'pg'

export const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    password: "xander",
    database: "database",
    port: "5432",
})


