// @ts-ignore
import SuperGif from 'libgif';
import Phaser from 'phaser';

export class GifUtils {
    /**
     * Loads a GIF file, parses it, and creates a Phaser animation.
     * @param scene The Phaser scene
     * @param key The key to use for the animation
     * @param url The URL of the GIF file
     * @param frameRate Optional frame rate (default 10)
     */
    static async loadGif(scene: Phaser.Scene, key: string, url: string, frameRate: number = 10): Promise<void> {
        return new Promise((resolve, reject) => {
            // Create a temporary image element
            const img = document.createElement('img');
            img.src = url;
            // img.crossOrigin = 'Anonymous'; // Enable CORS if needed

            // SuperGif configuration
            const gif = new SuperGif({ gif: img, auto_play: false, vp_l: 0, vp_t: 0, vp_w: null, vp_h: null, c_w: null, c_h: null });

            const onLoaded = () => {
                const length = gif.get_length();
                if (length === 0) {
                    console.warn(`GIF ${key} has no frames.`);
                    resolve();
                    return;
                }

                // Get dimensions from the first frame's canvas
                const canvas = gif.get_canvas();
                const width = canvas.width;
                const height = canvas.height;
                const textureKey = key + '_texture';

                // Check if texture already exists to avoid duplication
                if (scene.textures.exists(textureKey)) {
                    resolve();
                    return;
                }

                // Create a large canvas to hold all frames side-by-side (Sprite Sheet)
                // Creating a texture via createCanvas uses the scene's TextureManager
                const texture = scene.textures.createCanvas(textureKey, width * length, height);

                if (!texture) {
                    console.error('Failed to create canvas texture');
                    resolve();
                    return;
                }

                const context = texture.getContext();
                const frames: Phaser.Types.Animations.AnimationFrame[] = [];

                // Draw each frame onto the sprite sheet
                for (let i = 0; i < length; i++) {
                    gif.move_to(i);
                    // gif.get_canvas() returns the canvas with the current frame drawn
                    const frameCanvas = gif.get_canvas();

                    context.drawImage(frameCanvas, i * width, 0);

                    // Add the frame to the texture
                    // params: name, sourceIndex, x, y, width, height
                    texture.add(i, 0, i * width, 0, width, height);

                    frames.push({ key: textureKey, frame: i });
                }

                // Refresh the texture to upload to GPU
                texture.refresh();

                // Create the animation
                if (!scene.anims.exists(key)) {
                    scene.anims.create({
                        key: key,
                        frames: frames,
                        frameRate: frameRate,
                        repeat: -1
                    });
                }

                resolve();
            };

            // Hook into loading process
            try {
                gif.load(onLoaded);
            } catch (e) {
                console.error(`Failed to load GIF ${key}:`, e);
                resolve();
            }
        });
    }
}
