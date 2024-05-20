import crypto from "node:crypto";

export class Personaje {
  constructor(
    public name: string,
    public characterClass: string,
    public level: number,
    public hp: number,
    public mana: number,
    public attack: number,
    public items: string[],
    public id = crypto.randomUUID()
  ) {}
}
