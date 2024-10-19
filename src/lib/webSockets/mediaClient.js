import { browser } from '$app/environment';
import { backgroundColor, imageSrc, videoSrc, mediaType } from '$lib/stores/media';

let socket;

export function initializeMediaWebSocket() {
  if (browser) {
    socket = new WebSocket(`ws://${window.location.hostname}:3000/ws/media`);

    socket.onmessage = (event) => {
        console.log(event)
        const { control, file, type, color, backgroundType } = JSON.parse(event.data);

        if (file && type) {
            setTimeout(() => {
                if (type === "video") {
                    videoSrc.set(`src/lib/backgrounds/${file}`)
                    localStorage.setItem("videoSrc", `src/lib/backgrounds/${file}`);
                } else if (type === "image") {
                    imageSrc.set(`src/lib/backgrounds/${file}`)
                    localStorage.setItem("imageSrc", `src/lib/backgrounds/${file}`);
                }
            }, 100);
        }

        if (backgroundType) {
            mediaType.set(backgroundType)
            localStorage.setItem("mediaType", backgroundType);
        }

        if (color) {
            backgroundColor.set(color)
            localStorage.setItem("backgroundColor", color);
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