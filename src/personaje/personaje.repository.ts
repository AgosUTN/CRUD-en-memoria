import { repository } from "../shared/repository.js";
import { Personaje } from "./personaje.entity.js";

const personajes = [
  new Personaje("Luke", "Jedi", 100, 1500, 1000, 50, []),
  new Personaje("Han Solo", "Cazarecompensas", 85, 900, 0, 20, []),
];

export class PersonajeRepositorio implements repository<Personaje> {
  public findAll(): Personaje[] | undefined {
    return personajes;
  }

  public findOne(item: { id: string }): Personaje | undefined {
    const personaje = personajes.find(
      (personajeActual) => personajeActual.id === item.id
    );
    return personaje;
  }

  public add(item: Personaje): Personaje | undefined {
    personajes.push(item);
    return item;
  }

  public update(item: Personaje): Personaje | undefined {
    const idArray = personajes.findIndex(
      (personajeActual) => personajeActual.id === item.id
    );
    if (idArray !== -1) {
      personajes[idArray] = Object.assign({}, personajes[idArray], item);
    }
    return item;
  }
  public delete(item: { id: string }): Personaje | undefined {
    const idArray = personajes.findIndex(
      (personajeActual) => personajeActual.id === item.id
    );
    const personajeBorrado = personajes[idArray];
    if (idArray !== -1) {
      personajes.splice(idArray, 1);
    }
    return personajeBorrado; // si idArray = -1 ---> personaje1 == undefined
  }
}
