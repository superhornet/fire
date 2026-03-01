import { Color } from './Color.ts';

export class Fire {
    readonly #canvas: HTMLCanvasElement;
    readonly #ctx: CanvasRenderingContext2D;
    readonly #canvasWidth: number;
    readonly #canvasHeight: number;
    #intensity: number;
    readonly #fps: number;
    #threshold: number;
    #imageData: ImageData;
    #data: ImageDataArray;
    readonly #numPixels: number;
    #time;
    #colors!: Array<Color>;
    #firePixels: Array<number>;

    public get time(): number {
        return this.#time;
    }

    constructor() {
        this.#canvas = <HTMLCanvasElement>document.getElementById('stage');
        this.#ctx = <CanvasRenderingContext2D>this.getCanvas().getContext('2d');
        this.#canvasWidth = this.#canvas.width;
        this.#canvasHeight = this.#canvas.height;
        this.#intensity = 0;
        this.#fps = 30;
        this.#threshold = 0.5;
        this.#imageData = this.#ctx.getImageData(
            0,
            0,
            this.#canvasWidth,
            this.#canvasHeight
        );
        this.#data = this.#imageData.data;
        this.#numPixels = this.#data.length / 4;
        this.#time = Date.now();
        this.fillColors();
        this.#firePixels = Array.from(
            { length: this.#canvasHeight * this.#canvasWidth },
            () => {
                return 0;
            }
        );
    }
    /**
     * animate
     */
    public animate() {
        //requestAnimationFrame(this.animate);
        const now = Date.now();
        const dt = now - this.time;
        //console.log(dt);
        if (dt < 1000 / this.#fps) return;

        this.#time = now;
        const bottomLine = this.#canvasWidth * (this.#canvasHeight - 1);

        // draw random pixels on bottom row
        for (let x = 0; x < this.#canvasWidth; x++) {
            let value = 0;
            if (Math.random() > this.#threshold) value = 255;
            this.#firePixels[bottomLine + x] = value;
        }

        this.flipUpwards(bottomLine);

        const newFrame = this.renderFlame();
        if (this.#intensity === null) {
            if (Math.random() > 0.95) {
                this.randomizeThreshold();
            }
        }
        this.#ctx.putImageData(newFrame, 0, 0);
    }

    public getPixel(index: number): number {
        return this.#firePixels[index] as number;
    }

    flipUpwards(bl: number) {
        let value: number;

        for (let y = 0; y < this.#canvasHeight; ++y) {
            for (let x = 0; x < this.#canvasWidth; ++x) {
                if (x === 0) {
                    // average the 3 pixels to the right,
                    // if this is the left edge
                    value = 2 * this.getPixel(bl + x);
                    //value += this.getPixel([bl]);
                    value += this.getPixel(bl - this.#canvasWidth);
                    value /= 3;
                } else if (x === this.#canvasWidth - 1) {
                    // average the 3 pixels to the left,
                    // if this is the right edge
                    value = this.getPixel(bl + x);
                    value += this.getPixel(bl - this.#canvasWidth + x);
                    value += this.getPixel(bl + x - 1);
                    value /= 3;
                } else {
                    // average 4 pixels,
                    // if somewhere in the middle
                    value = this.getPixel(bl + x);
                    value += this.getPixel(bl + x + 1);
                    value += this.getPixel(bl + x - 1);
                    value += this.getPixel(bl - this.#canvasWidth + x);
                    value /= 4;
                }
                if (value > 1) value -= 1;
                value = Math.floor(value);
                const position = bl - this.#canvasWidth + x;
                this.#firePixels[position] = value;
            }
            bl -= this.#canvasWidth;
        }
    }
    renderFlame() {
        const skipRows = 2;
        for (let y = 0; y < this.#canvasHeight; ++y) {
            for (let x = 0; x < this.#canvasWidth; ++x) {
                let index = y * this.#canvasWidth * 4 + x * 4;
                const value =
                    this.#firePixels[(y - skipRows) * this.#canvasWidth + x] ||
                    0;

                this.#data[index] = this.colorsAt(value).color.r;
                this.#data[++index] = this.colorsAt(value).color.g;
                this.#data[++index] = this.colorsAt(value).color.b;
                // eslint-disable-next-line no-useless-assignment
                this.#data[++index] = 255;
            }
        }
        return new ImageData(
            new Uint8ClampedArray(this.#data),
            this.#canvasWidth,
            this.#canvasHeight
        );
    }
    private fillColors() {
        this.#colors = Array.from(
            { length: 256 },
            (_: unknown, index: number) => {
                if (index >= 32 && index < 64)
                    return new Color(
                        (index - 32) << 3,
                        0,
                        64 - ((index - 32) << 1)
                    );
                else if (index >= 64 && index < 96)
                    return new Color(255, (index - 64) << 3, 0);
                else if (index >= 96 && index < 128)
                    return new Color(255, 255, 64 + ((index - 96) << 2));
                else if (index >= 128 && index < 160)
                    return new Color(255, 255, 128 + ((index - 128) << 2));
                else if (index >= 160 && index < 192)
                    return new Color(255, 255, 192 + ((index - 160) << 2));
                else if (index >= 192 && index < 224)
                    return new Color(255, 255, 192 + (index - 192));
                else if (index >= 224 && index < 256)
                    return new Color(255, 255, 224 + (index - 224));
                else
                    return new Color(index << 3, 0, 64 - (index << 1)) as Color;
            }
        );
    }
    /**
     * This is odd.  It ends up being a random number between [0.5,0.8)
     */
    public randomizeThreshold() {
        this.#threshold += Math.random() * 0.2 - 0.1;
        this.#threshold = Math.min(Math.max(this.#threshold, 0.5), 0.8);
    }
    /**
     * getCanvas
     */
    public getCanvas() {
        return this.#canvas;
    }

    public colorsAt(index: number): Color {
        return this.#colors[index] as Color;
    }

    public get threshold(): number {
        return this.#threshold;
    }

    public set threshold(t: number) {
        this.#threshold = t;
    }

    public get intensity(): number {
        return this.#intensity;
    }

    public set intensity(value: number) {
        this.#intensity = value;
    }

    public get countPixels(): number {
        return this.#numPixels;
    }
}
