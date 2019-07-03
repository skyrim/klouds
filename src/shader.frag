precision mediump float;

uniform vec2 resolution;
uniform float layerCount;
uniform float time;
uniform vec3 bgColor;
uniform vec3 cloudColor1;
uniform vec3 cloudColor2;

#define TAU 6.28318530718

float func(float pX) {
    return 0.6 * (0.5 * sin(0.1 * pX) + 0.5 * sin(0.553 * pX) + 0.7 * sin(1.2 * pX));
}

float funcR(float pX) {
    return 0.5 + 0.25 * (1.0 + sin(mod(40.0 * pX, TAU)));
}

float layer(vec2 pQ, float pT) {
    vec2 Qt = 3.5 * pQ;
    pT *= 0.5;
    Qt.x += pT;

    float Xi = floor(Qt.x);
    float Xf = Qt.x - Xi - 0.5;

    vec2 C;
    float Yi;
    float D = 1.0 - step(Qt.y,  func(Qt.x));

    Yi = func(Xi + 0.5);
    C = vec2(Xf, Qt.y - Yi ); 
    D =  min(D, length(C) - funcR(Xi + pT / 80.0));

    Yi = func(Xi + 1.0 + 0.5);
    C = vec2(Xf - 1.0, Qt.y - Yi ); 
    D =  min(D, length(C) - funcR(Xi + 1.0+ pT / 80.0));

    Yi = func(Xi - 1.0 + 0.5);
    C = vec2(Xf + 1.0, Qt.y - Yi ); 
    D =  min(D, length(C) - funcR(Xi - 1.0 + pT / 80.0));

    return min(1.0, D);
}

void main() {
    float t = time;
    vec2 UV = 2.0 * (gl_FragCoord.xy - resolution.xy / 2.0) / min(resolution.x, resolution.y);	
    
    vec3 Color = bgColor;

    for(float i = 0.0; i < 0.8; i += 0.1) {
        if (i >= layerCount) {
            break;
        }

        float Lt =  t * (0.5 + 2.0 * i) * (1.0 + 0.1 * sin(226.0 * i)) + 1000.0 * i;
        vec2 Lp = vec2(100.0 * i, 0.8 * (i / (layerCount - 0.0999) / 0.8) - 0.3);
        float L = layer(UV + Lp, Lt);

        float Blur = 4.0 * (0.5 * abs(2.0 - 5.0 * i)) / (11.0 - 5.0 * i);

        float V = mix(0.0, 1.0, 1.0 - smoothstep(0.0, 0.01 + 0.2 * Blur, L));
        vec3 Lc = mix(cloudColor1, cloudColor2, i / (layerCount - 0.0999) / 0.8);

        Color = mix(Color, Lc,  V);
    }

    gl_FragColor = vec4(Color, 1.0);
}
