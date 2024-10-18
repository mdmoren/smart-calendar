

import dotenv from 'dotenv';
dotenv.config();

import { google } from 'googleapis';
import fs from 'fs';
import express from 'express'

const router = express.Router();

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/tasks.readonly'
];

const TOKEN_PATH = 'tokens/google_tokens.json';

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET_ID,
  process.env.REDIRECT
);


if (fs.existsSync(TOKEN_PATH)) {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  oauth2Client.setCredentials(tokens);
  console.log('[INFO] Loaded tokens from file');
}

router.get('/login', (req, res) => {
  console.log('[INFO] Generating Google OAuth URL for user authentication');
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'  
  });

  res.redirect(url);
});

router.get('/redirect', (req, res) => {
  const code = req.query.code;
  console.log('[INFO] Received authorization code:', code);

  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.error('[ERROR] Failed to retrieve token:', err);
      res.send('Error');
      return;
    }

    oauth2Client.setCredentials(tokens);

    
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('[INFO] Tokens saved to', TOKEN_PATH);

    res.send('Successfully logged in');
  });
});


const isTokenExpired = (oauth2Client) => {
  const token = oauth2Client.credentials;
  if (!token) {
    console.log('[INFO] No token found, access token is expired or missing');
    return true;
  }
  const isExpired = !token.expiry_date || Date.now() >= token.expiry_date;
  if (isExpired) {
    console.log('[INFO] Access token expired');
  }
  return isExpired;
};

const ensureValidAccessToken = async (req, res, next) => {
  if (isTokenExpired(oauth2Client)) {
    try {
      console.log('[INFO] Refreshing access token');
      const newTokens = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(newTokens.credentials);

      
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(oauth2Client.credentials));
      console.log('[INFO] Access token refreshed and saved');
    } catch (error) {
      console.error('[ERROR] Failed to refresh access token:', error);
      return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
    }
  }
  next();
};

router.get('/calendars', ensureValidAccessToken, (req, res) => {
  console.log('[INFO] Fetching calendar list');
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  calendar.calendarList.list({}, (err, response) => {
    if (err) {
      console.error('[ERROR] Error fetching calendars:', err);
      res.status(500).json({ message: 'Error fetching calendars' });
      return;
    }

    console.log('[INFO] Calendars fetched successfully');
    const calendars = response.data.items;
    res.json(calendars);
  });
});

router.get('/events', ensureValidAccessToken, async (req, res) => {
  try {
    console.log('[INFO] Fetching events for all calendars');
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const calendarListResponse = await calendar.calendarList.list();
    const calendars = calendarListResponse.data.items;

    if (!calendars || calendars.length === 0) {
      console.log('[INFO] No calendars found');
      return res.status(404).json({ message: 'No calendars found' });
    }

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const timeMin = lastMonth.toISOString();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    const timeMax = nextMonth.toISOString();

    console.log(`[INFO] Fetching events from ${timeMin} to ${timeMax}`);

    const eventsPromises = calendars.map(async (cal) => {
      const eventsResponse = await calendar.events.list({
        calendarId: cal.id,
        timeMin: timeMin,
        timeMax: timeMax,
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime'
      });
      console.log(`[INFO] Fetched ${eventsResponse.data.items.length} events from calendar: ${cal.summary}`);
      return {
        calendar: cal.summary,
        events: eventsResponse.data.items
      };
    });

    const allEvents = await Promise.all(eventsPromises);
    console.log('[INFO] Events fetched successfully');
    res.json(allEvents);
  } catch (error) {
    console.error('[ERROR] Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

router.get('/tasks', ensureValidAccessToken, async (req, res) => {
  try {
    console.log('[INFO] Fetching task lists');
    const tasks = google.tasks({ version: 'v1', auth: oauth2Client });
    const taskLists = await tasks.tasklists.list();

    if (!taskLists.data.items || taskLists.data.items.length === 0) {
      console.log('[INFO] No task lists found');
      return res.status(404).json({ message: 'No task lists found' });
    }

    console.log(`[INFO] Found ${taskLists.data.items.length} task lists`);

    const allTasks = await Promise.all(taskLists.data.items.map(async (taskList) => {
      try {
        console.log(`[INFO] Fetching tasks for list: ${taskList.title}`);
        const taskResponse = await tasks.tasks.list({
          tasklist: taskList.id,
          showCompleted: true,
          showHidden: false,
        });

        console.log(`[INFO] Fetched ${taskResponse.data.items.length} tasks for list: ${taskList.title}`);
        return {
          listName: taskList.title,
          tasks: taskResponse.data.items || []
        };
      } catch (error) {
        console.error(`[ERROR] Error fetching tasks for list ${taskList.title}:`, error);
        return {
          listName: taskList.title,
          error: error.message
        };
      }
    }));

    console.log('[INFO] Tasks fetched successfully');
    res.json(allTasks);
  } catch (error) {
    console.error('[ERROR] Error in /tasks endpoint:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

export default router