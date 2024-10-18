import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
app.use(express.json());
app.use(cors());

import googleRoutes from './routes/google.js';
import spotifyRoutes, { setupWebSocket as setupSpotifyWebSocket } from './routes/spotify.js';
import mediaUploadRoutes, { setupMediaUploadWebSocket } from './routes/mediaUpload.js';

app.use('/google', googleRoutes);
app.use('/spotify', spotifyRoutes);
app.use('/media', mediaUploadRoutes);

const server = http.createServer(app);
const wssSpotify = new WebSocketServer({ noServer: true });  
const wssMediaUpload = new WebSocketServer({ noServer: true });  

app.use(express.static('public'));

setupSpotifyWebSocket(wssSpotify);
setupMediaUploadWebSocket(wssMediaUpload);

server.on('upgrade', (request, socket, head) => {
    
    if (request.url === '/ws/spotify') {
        wssSpotify.handleUpgrade(request, socket, head, (ws) => {
            wssSpotify.emit('connection', ws, request);
        });
    } else if (request.url === '/ws/media') {
        wssMediaUpload.handleUpgrade(request, socket, head, (ws) => {
            wssMediaUpload.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[INFO] Server is running on http://localhost:${PORT}`);
});
