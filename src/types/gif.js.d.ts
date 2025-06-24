declare module 'gif.js' {
  export default class GIF {
    constructor(options?: any);
    on(event: string, callback: (...args: any[]) => void): void;
    addFrame(canvas: HTMLCanvasElement, options?: any): void;
    render(): void;
    abort(): void;
  }
} 