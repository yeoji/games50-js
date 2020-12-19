import Phaser from 'phaser';

class WhiteShader extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
    constructor(game) {
        super({
            game: game,
            renderer: game.renderer,
            fragShader:`
                precision mediump float;
                uniform sampler2D uMainSampler;
                varying vec2 outTexCoord;
                void main(void) {
                    vec4 color = texture2D(uMainSampler, outTexCoord);
                    if(color.a == 1.0) {
                        color.rgb += vec3(1);
                    }
                    gl_FragColor = color;
                }`
        });
    }
}

export default WhiteShader;