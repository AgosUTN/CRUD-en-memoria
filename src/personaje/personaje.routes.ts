import { Router } from "express";
import {
  buscaPersonajes,
  buscaPersonaje,
  altaPersonaje,
  sanitizeInput,
  actualizarPersonaje,
  bajaPersonaje,
} from "./personaje.controller.js";

export const pRouter = Router();

pRouter.get("/", buscaPersonajes);
pRouter.get("/:id", buscaPersonaje);
pRouter.post("/", sanitizeInput, altaPersonaje);
pRouter.put("/:id", sanitizeInput, actualizarPersonaje);
pRouter.patch("/:id", sanitizeInput, actualizarPersonaje);
pRouter.delete("/:id", bajaPersonaje);
