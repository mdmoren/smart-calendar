import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import fs from 'fs';

const router = express.Router();
const TOKEN_PATH = 'tokens/spotify_tokens.json';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT,
});


if (fs.existsSync(TOKEN_PATH)) {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  spotifyApi.setAccessToken(tokens.access_token);
  spotifyApi.setRefreshToken(tokens.refresh_token);
  console.log('[INFO] Loaded Spotify tokens from file');
}


router.get('/login', (req, res) => {
  const scopes = ['user-read-playback-state', 'user-read-currently-playing'];
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});


router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    
    
    fs.writeFileSync(TOKEN_PATH, JSON.stringify({ access_token, refresh_token }));
    console.log('[INFO] Spotify tokens saved to', TOKEN_PATH);
    
    res.redirect('/');
  } catch (error) {
    console.error('[ERROR] Error in Spotify callback:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});


const refreshAccessToken = async () => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    const { access_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    
    
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    tokens.access_token = access_token;
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    
    console.log('[INFO] Spotify access token refreshed and saved');
  } catch (error) {
    console.error('[ERROR] Could not refresh Spotify access token', error);
  }
};


const sendNowPlaying = async (ws) => {
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState();
    ws.send(JSON.stringify(data.body));
  } catch (error) {
    console.error('[ERROR] Error fetching Spotify playback state:', error);
    if (error.statusCode === 401) {
      console.log('[INFO] Access token expired, refreshing...');
      await refreshAccessToken();
      
      const retryData = await spotifyApi.getMyCurrentPlaybackState();
      ws.send(JSON.stringify(retryData.body));
    }
  }
};


const setupWebSocket = (wss) => {
  wss.on('connection', (ws) => {
    console.log('[INFO] Spotify client connected');

    
    sendNowPlaying(ws);

    
    const interval = setInterval(() => sendNowPlaying(ws), 2500);

    ws.on('close', () => {
      console.log('[INFO] Spotify client disconnected');
      clearInterval(interval);
    });
  });
};

export { setupWebSocket };
export default router;
