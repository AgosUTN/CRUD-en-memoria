import express, { NextFunction, Request, Response } from "express";
import { Personaje } from "./personaje/personaje.entity.js";
import { PersonajeRepositorio } from "./personaje/personaje.repository.js";

const app = express();

const personajes = [
  new Personaje("Luke", "Jedi", 100, 1500, 1000, 50, []),
  new Personaje("Han Solo", "Cazarecompensas", 85, 900, 0, 20, []),
];

app.use(express.json());

const repository = new PersonajeRepositorio();

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.inputOK = {
    name: req.body.name,
    characterClass: req.body.characterClass,
    level: req.body.level,
    hp: req.body.hp,
    mana: req.body.mana,
    attack: req.body.attack,
    items: req.body.items,
  };

  Object.keys(req.body.inputOK).forEach((key) => {
    if (req.body.inputOK[key] === undefined) {
      delete req.body.inputOK[key];
    }
  });

  next();
}

app.get("/api/personajes", (req, res) => {
  return res.json({ data: repository.findAll() });
});

app.get("/api/personajes/:id", (req, res) => {
  const personaje = repository.findOne({ id: req.params.id });

  if (!personaje) {
    return res.status(404).send({ message: "Personaje no encontrado" });
  }
  return res.json({ data: personaje });
});

app.post("/api/personajes", sanitizeInput, (req, res) => {
  const input = req.body.inputOK; //Podrian mandarse directamente req.body.inputOK.name y asi, pero queda mas legible de esta forma.
  const personajePost = new Personaje(
    input.name,
    input.characterClass,
    input.level,
    input.hp,
    input.mana,
    input.attack,
    input.items
  );
  const personajeGuardado = repository.add(personajePost);
  return res
    .status(201)
    .send({ message: "Personaje cargado", data: personajeGuardado });
});

app.put("/api/personajes/:id", sanitizeInput, (req, res) => {
  req.body.inputOK.id = req.params.id;
  const personajeUpdated = repository.update(req.body.inputOK);

  if (!personajeUpdated) {
    return res
      .status(404)
      .send({ message: "No existe el id del personaje ingresado." });
  }
  return res
    .status(200)
    .send({ message: "Personaje actualizado", data: personajeUpdated });
});

app.patch("/api/personajes/:id", sanitizeInput, (req, res) => {
  req.body.inputOK.id = req.params.id;
  const personajeUpdated = repository.update(req.body.inputOK);

  if (!personajeUpdated) {
    return res
      .status(404)
      .send({ message: "No existe el id del personaje ingresado." });
  }
  return res
    .status(200)
    .send({ message: "Personaje actualizado", data: personajeUpdated });
});

app.delete("/api/personajes/:id", (req, res) => {
  const personajeBorrado = repository.delete({ id: req.params.id });

  if (!personajeBorrado) {
    return res.status(404).send({ message: "Personaje no encontrado." });
  }
  return res
    .status(200)
    .send({ message: "Personaje eliminado", data: personajeBorrado });
});

app.use((req, res) => {
  return res.status(404).send({ message: "Recurso no encontrado" });
});

app.listen(3000, () => console.log("Running on port 3000"));
