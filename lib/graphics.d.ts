export declare function createContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null;
export declare enum ShaderType {
    VERTEX = 0,
    FRAGMENT = 1
}
export declare function createShader(gl: WebGLRenderingContext, type: ShaderType, source: string): WebGLShader | null;
export declare function createProgram(gl: WebGLRenderingContext, vertShaderSrc: string, fragShaderSrc: string, attributeNames: string[], uniformNames: string[]): {
    handle: WebGLProgram;
    attributes: {
        [name: string]: number;
    };
    uniforms: {
        [name: string]: WebGLUniformLocation;
    };
} | null;
export interface Program {
    handle: WebGLProgram;
    attributes: {
        [name: string]: number;
    };
    uniforms: {
        [name: string]: WebGLUniformLocation;
    };
}
export declare function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean;
