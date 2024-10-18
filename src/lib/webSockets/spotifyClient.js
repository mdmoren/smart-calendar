import { browser } from '$app/environment';
import { currentTrack, isPlaying, progress, duration, device } from '$lib/stores/spotify';

let socket;

export function initializeSpotifyWebSocket() {
  if (browser) {
    socket = new WebSocket(`ws://${window.location.hostname}:3000/ws/spotify`);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.item) {
          currentTrack.set({
            name: data.item.name,
            artist: data.item.artists[0].name,
            albumArt: data.item.album.images[0].url
          });
          isPlaying.set(data.is_playing);
          progress.set(data.progress_ms);
          duration.set(data.item.duration_ms);
          device.set({
            name: data.device.name
          })

        } else {
          currentTrack.set(null)
          isPlaying.set(false);
          progress.set(0);
          duration.set(0);
          device.set(null)
      };

    } 

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }
}

export function closeSpotifyWebSocket() {
  if (socket) {
    socket.close();
  }
}