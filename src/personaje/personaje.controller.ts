import { Request, Response, NextFunction } from "express";
import { PersonajeRepositorio } from "./personaje.repository.js";
import { Personaje } from "./personaje.entity.js";

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

function buscaPersonajes(req: Request, res: Response) {
  return res.json({ data: repository.findAll() });
}

function buscaPersonaje(req: Request, res: Response) {
  const personaje = repository.findOne({ id: req.params.id });
  if (!personaje) {
    return res.status(404).send({ message: "Personaje no encontrado" });
  }
  return res.json({ data: personaje });
}

function altaPersonaje(req: Request, res: Response) {
  const input = req.body.inputOK;
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
}

function actualizarPersonaje(req: Request, res: Response) {
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
}

function bajaPersonaje(req: Request, res: Response) {
  const personajeBorrado = repository.delete({ id: req.params.id });

  if (!personajeBorrado) {
    return res.status(404).send({ message: "Personaje no encontrado." });
  }
  return res
    .status(200)
    .send({ message: "Personaje eliminado", data: personajeBorrado });
}

export {
  sanitizeInput,
  buscaPersonajes,
  buscaPersonaje,
  altaPersonaje,
  actualizarPersonaje,
  bajaPersonaje,
};
