import { type ColorType } from './types/ColorType.ts';

interface IColor {
    get color(): ColorType;
}

export class Color implements IColor {
    #r: number;
    #g: number;
    #b: number;
    constructor(r: number, g: number, b: number) {
        this.#r = r;
        this.#g = g;
        this.#b = b;
    }
    get color(): ColorType {
        return { r: this.#r, g: this.#g, b: this.#b } as ColorType;
    }

    public set color(c: ColorType) {
        this.#r = c.r;
        this.#g = c.g;
        this.#b = c.b;
    }
}
