import express from "express";

import { pRouter } from "./personaje/personaje.routes.js";

const app = express();

app.use(express.json());

app.use("/api/personajes", pRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Recurso no encontrado" });
});

app.listen(3000, () => console.log("Running on port 3000"));
