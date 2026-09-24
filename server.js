// server.js - Proxy para webhooks de Discord desde Roblox
const express = require("express");
const app = express();
app.use(express.json());

// Guarda tu webhook real como variable de entorno, no hardcodeada
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.post("/webhook", async (req, res) => {
	try {
		const response = await fetch(DISCORD_WEBHOOK_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "Mozilla/5.0", // clave: evita el bloqueo por User-Agent de Roblox
			},
			body: JSON.stringify(req.body),
		});

		if (!response.ok) {
			const text = await response.text();
			console.error("Discord rechazó el mensaje:", response.status, text);
			return res.status(response.status).send(text);
		}

		res.status(200).send("OK");
	} catch (err) {
		console.error("Error en proxy:", err);
		res.status(500).send("Error interno");
	}
});

// Ruta de warmup - para "despertar" el proxy sin gastar mensajes de Discord
app.get("/ping", (req, res) => {
	res.status(200).send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy corriendo en puerto ${PORT}`));
