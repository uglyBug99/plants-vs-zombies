declare module 'phaser3-rex-plugins/plugins/gifloader-plugin.js' {
    import Phaser from 'phaser';

    export default class GifLoaderPlugin extends Phaser.Plugins.BasePlugin {
        constructor(pluginManager: Phaser.Plugins.PluginManager);
    }
}

declare module 'phaser3-rex-plugins/plugins/gameobjects/rendertexture/gif/Gif.js' {
    import Phaser from 'phaser';

    export default class Gif extends Phaser.GameObjects.RenderTexture {
        constructor(scene: Phaser.Scene, x: number, y: number, key?: string);
        play(): this;
        pause(): this;
        stop(): this;
    }
}
