import React, { useState, useEffect } from 'react';

const CLIENT_ID = '818253070758-u4ihdpf94k359bcn0l7ru43o2av936l3.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCIvjfFGMDFHhOwMmiAi6agrdne1ozbeUA';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

function Calendar() {
  const [tokenClient, setTokenClient] = useState(null);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.defer = true;
    script1.onload = gapiLoaded;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    script2.onload = gisLoaded;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  const gapiLoaded = () => {
    window.gapi.load('client', initializeGapiClient);
  };

  const initializeGapiClient = async () => {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    setGapiInited(true);
    maybeEnableButtons();
  };

  const gisLoaded = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '',
    });
    setTokenClient(tokenClient);
    setGisInited(true);
    maybeEnableButtons();
  };

  const maybeEnableButtons = () => {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  };

  const handleAuthClick = () => {
    if (!tokenClient) return;

    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      document.getElementById('signout_button').style.visibility = 'visible';
      document.getElementById('authorize_button').innerText = 'Refresh';
      await listUpcomingEvents();
    };

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
  };

  const listUpcomingEvents = async () => {
    let response;
    try {
      const request = {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await window.gapi.client.calendar.events.list(request);
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }
    const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n'
    );
    document.getElementById('content').innerText = output;
  };

  const createEvent = async () => {
    const event = {
      summary: 'Sample Event',
      description: 'This is a sample event created using the Google Calendar API.',
      start: {
        dateTime: '2024-05-06T10:00:00',
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: '2024-05-06T11:00:00',
        timeZone: 'Asia/Kolkata',
      },
    };

    try {
      await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event. Please check the console for details.');
    }
  };

  return (
    <div>
      <p>Google Calendar API Quickstart</p>
      <button id="authorize_button" onClick={handleAuthClick} style={{ visibility: 'visible' }}>
        Authorize
      </button>
      <button id="signout_button" onClick={handleSignoutClick} style={{ visibility: 'visible' }}>
        Sign Out
      </button>
      <button onClick={createEvent}>Create Event</button>
      <pre id="content" style={{ whiteSpace: 'pre-wrap' }}></pre>
    </div>
  );
}

export default Calendar;
