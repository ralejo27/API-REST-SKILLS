import { Router } from "express";
import { pool } from '../db.js'

const router = Router();

router.get("/users", async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error de servidor" });
    }

});

router.get("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error de servidor" });
    }
});

router.post("/users", async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const result = await pool.query(
            "INSERT INTO users (name, email) VALUES ($1, $2)",
            [data.name, data.email]);
        console.log(result);
        res.send('Usuario creado');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el usuario" });
    }
});

router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { rows, rowCount } = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
    );
    console.log(rows);

    if (rows.length === 0) {
        return res.status(404).json({ message: "Registro no encontrado"});
    }
    return res.sendStatus(204)

});

router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const { rows } = await pool.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
            [data.name, data.email, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        return res.status(200).json(rows[0]);

    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Error de servidor" });
    }
});

export default router;