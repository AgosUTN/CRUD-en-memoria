import express, { NextFunction, Request, Response } from "express";
import { Personaje } from "./personajes.js";

const app = express();

app.use(express.json());

const personajes = [
  new Personaje("Luke", "Jedi", 100, 1500, 1000, 50, []),
  new Personaje("Han Solo", "Cazarecompensas", 85, 900, 0, 20, []),
];

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
  return res.json({ data: personajes });
});

app.get("/api/personajes/:id", (req, res) => {
  const personaje = personajes.find(
    (personajeActual) => personajeActual.id === req.params.id
  );
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
  personajes.push(personajePost);
  return res
    .status(201)
    .send({ message: "Personaje cargado", data: personajePost });
});

app.put("/api/personajes/:id", sanitizeInput, (req, res) => {
  const idArray = personajes.findIndex(
    (personajeActual) => personajeActual.id === req.params.id
  );

  if (idArray === -1) {
    return res
      .status(404)
      .send({ message: "No existe el id del personaje ingresado." });
  }
  personajes[idArray] = Object.assign(
    {},
    personajes[idArray],
    req.body.inputOK
  );
  return res
    .status(200)
    .send({ message: "Personaje actualizado", data: personajes[idArray] });
});

app.patch("/api/personajes/:id", sanitizeInput, (req, res) => {
  const idArray = personajes.findIndex(
    (personajeActual) => personajeActual.id === req.params.id
  );
  if (idArray === -1) {
    return res
      .status(404)
      .send({ message: "No existe el id del personaje ingresado." });
  }
  personajes[idArray] = Object.assign(
    {},
    personajes[idArray],
    req.body.inputOK
  );
  return res.status(200).send({
    message: "Personaje actualizado con PATCH",
    data: personajes[idArray],
  });
});

app.delete("/api/personajes/:id", (req, res) => {
  const idArray = personajes.findIndex(
    (personajeActual) => personajeActual.id === req.params.id
  );
  if (idArray === -1) {
    return res.status(404).send({ message: "Personaje no encontrado." });
  }
  personajes.splice(idArray, 1);
  return res.status(200).send({ message: "Personaje eliminado" });
});

app.use((req, res) => {
  return res.status(404).send({ message: "Recurso no encontrado" });
});

app.listen(3000, () => console.log("Running on port 3000"));
