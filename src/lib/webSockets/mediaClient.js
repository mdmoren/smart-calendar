import { browser } from '$app/environment';
import { backgroundColor, imageSrc, videoSrc, mediaType } from '$lib/stores/media';

let socket;

export function initializeMediaWebSocket() {
  if (browser) {
    socket = new WebSocket(`ws://${window.location.hostname}:3000/ws/media`);

    socket.onmessage = (event) => {
        const { control, file, type, color, backgroundType } = JSON.parse(event.data);

        if (file && type) {
            setTimeout(() => {
                if (type === "video") {
                    videoSrc.set(`src/lib/backgrounds/${file}`)
                } else if (type === "image") {
                    imageSrc.set(`src/lib/backgrounds/${file}`)
                }
            }, 100);
        }

        if (backgroundType) {
            mediaType.set(backgroundType)
            location.reload();
        }

        if (color) {
            backgroundColor.set(color)
            location.reload();
        }

        if (control === "reload") {
            location.reload();
        }
    } 

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }
}

export function closeMediaWebSocket() {
  if (socket) {
    socket.close();
  }
}