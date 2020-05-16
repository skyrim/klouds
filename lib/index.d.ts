export declare type Vec3 = [number, number, number];
export declare const VERSION: string;
export interface KloudsOptions {
    selector: string | HTMLCanvasElement;
    speed?: number;
    layerCount?: number;
    bgColor?: Vec3;
    cloudColor1?: Vec3;
    cloudColor2?: Vec3;
}
export declare class Klouds {
    private canvas;
    private gl;
    private program;
    private buffer;
    private isRunning;
    private accumTime;
    private lastTime;
    private speed;
    private layerCount;
    private bgColor;
    private cloudColor1;
    private cloudColor2;
    constructor(options: KloudsOptions);
    private queryRootElement;
    private initGraphics;
    private render;
    start(): void;
    stop(): void;
    setSpeed(speed: number): void;
    setCloudColor1(color: string | Vec3): void;
    setCloudColor2(color: string | Vec3): void;
    setBgColor(color: string | Vec3): void;
    setLayerCount(count: number): void;
    getSpeed(): number;
    getLayerCount(): number;
    getBgColor(): number[];
    getCloudColor1(): number[];
    getCloudColor2(): number[];
}
export declare function create(options: KloudsOptions): Klouds;
