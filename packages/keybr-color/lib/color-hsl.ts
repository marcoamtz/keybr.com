import { clamp, isNumber, isObjectLike } from "@keybr/lang";
import { Color } from "./color.ts";
import { hslToHsv, hslToRgb } from "./convert.ts";
import { type Hsl } from "./types.ts";

/**
 * A color in the HSL model.
 */
export class HslColor extends Color implements Hsl {
  #h: number = 0;
  #s: number = 0;
  #l: number = 0;
  #a: number = 1;

  constructor();
  constructor(h: number, s: number, l: number, a?: number);
  constructor(value: Readonly<{ h: number; s: number; l: number; a?: number }>);
  constructor(...args: any[]) {
    super();
    const l = args.length;
    if (l === 0) {
      return;
    }
    if (
      l === 3 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2])
    ) {
      this.h = args[0];
      this.s = args[1];
      this.l = args[2];
      this.a = 1;
      return this;
    }
    if (
      l === 4 &&
      isNumber(args[0]) &&
      isNumber(args[1]) &&
      isNumber(args[2]) &&
      isNumber(args[3])
    ) {
      this.h = args[0];
      this.s = args[1];
      this.l = args[2];
      this.a = args[3];
      return this;
    }
    const [value] = args;
    if (l === 1 && HslColor.is(value)) {
      this.h = value.h;
      this.s = value.s;
      this.l = value.l;
      this.a = value.a ?? 1;
      return this;
    }
    throw new TypeError();
  }

  get h(): number {
    return this.#h;
  }

  set h(value: number) {
    this.#h = clamp(value, 0, 1);
  }

  get s(): number {
    return this.#s;
  }

  set s(value: number) {
    this.#s = clamp(value, 0, 1);
  }

  get l(): number {
    return this.#l;
  }

  set l(value: number) {
    this.#l = clamp(value, 0, 1);
  }

  get a(): number {
    return this.#a;
  }

  set a(value: number) {
    this.#a = clamp(value, 0, 1);
  }

  override toRgb() {
    return hslToRgb(this);
  }

  override toHsl(clone?: boolean) {
    if (clone) {
      return new HslColor(this);
    }
    return this;
  }

  override toHsv(clone?: boolean) {
    return hslToHsv(this);
  }

  override format() {
    const h = Math.round(this.h * 360);
    const s = Math.round(this.s * 100);
    const l = Math.round(this.l * 100);
    const a = this.a;
    if (a < 1) {
      return `hsl(${h} ${s}% ${l}%/${a})`;
    } else {
      return `hsl(${h} ${s}% ${l}%)`;
    }
  }

  get [Symbol.toStringTag]() {
    return "HslColor";
  }

  static is(o: any): o is Hsl {
    return (
      isObjectLike(o) &&
      isNumber(o.h) &&
      isNumber(o.s) &&
      isNumber(o.l) &&
      (o.a == null || isNumber(o.a))
    );
  }
}
