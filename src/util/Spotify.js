const clientID = '6d7f450a2d294423a212e3874d46ad4f';
const redirectUri = window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:3000/'
  : 'https://wemiibidun.github.io/jammming/';
const scope = 'playlist-modify-public';

let accessToken;
let tokenExpiresAt = 0;

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const base64UrlEncode = (arrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const generateCodeChallenge = async (verifier) => {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
};

const Spotify = {
  async getAccessToken() {
    if (accessToken && Date.now() < tokenExpiresAt) {
      return accessToken;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const storedVerifier = window.localStorage.getItem('spotify_code_verifier');

    if (code) {
      const body = new URLSearchParams({
        client_id: clientID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: storedVerifier || ''
      });

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });

      const data = await response.json();
      accessToken = data.access_token;
      tokenExpiresAt = Date.now() + (data.expires_in || 0) * 1000;

      window.history.replaceState({}, document.title, window.location.pathname);
      return accessToken;
    }

    const verifier = generateRandomString(64);
    const challenge = await generateCodeChallenge(verifier);
    window.localStorage.setItem('spotify_code_verifier', verifier);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.search = new URLSearchParams({
      response_type: 'code',
      client_id: clientID,
      scope,
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge: challenge
    }).toString();

    window.location = authUrl.toString();
    return null;
  },

  async search(term) {
    const token = await Spotify.getAccessToken();
    if (!token) {
      return [];
    }

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => response.json()
      ).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          uri: track.uri
        }));
      });
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const token = await Spotify.getAccessToken();
    if (!token) {
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers }
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers,
          method: 'POST',
          body: JSON.stringify({ name })
        }).then(response => response.json()
        ).then(jsonResponse => {
          const playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris })
          });
        });
    });
  }
};

export default Spotify;
