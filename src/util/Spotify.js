let accessToken = '';
const clientId = '556f0c2f105a474495f2cccf906c34b4';
const redirectURI = 'http://localhost:3000/';
const spotifyAuthorizeURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
const spotifySearchURL = `https://api.spotify.com/v1/search?type=track&q=`;
const spotifyIdURL = `https://api.spotify.com/v1/me`;

export const Spotify = {

    convertDuration(durationMs) {
        let min = Math.floor((durationMs / 1000) / 60);
        let sec = String(Math.floor((durationMs / 1000) % 60));
        if (sec.length < 2) {
            sec = '0'+sec;
        }
        return `${min}:${sec}`;
    },

    getAccessToken() {
        if (accessToken) {
            return new Promise(resolve => resolve(accessToken));
        } else {
            let newToken = window.location.href.match(/access_token=([^&]*)/);
            let expiresIn = window.location.href.match(/expires_in=([^&]*)/);
            if (newToken && expiresIn) {
                accessToken = newToken[1];
                expiresIn = expiresIn[1];
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return new Promise(resolve => resolve(accessToken));
            } else {
                window.location.replace(spotifyAuthorizeURL);
            }
        }
    },

    getSpotifyId() {
        try {
            return Spotify.getAccessToken().then(() => {
                return fetch(spotifyIdURL, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
            }).then(response => response.json()).then(jsonResponse => {
                if (jsonResponse.id) {
                    return jsonResponse.id;
                }
            });
        } catch (error) {
            console.log(error);
        }
    },

    getPlayListId(spotifyId, playListTitle) {
        try {
            return Spotify.getAccessToken().then(() => {
                let url = `https://api.spotify.com/v1/users/${spotifyId}/playlists`;
                return fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            }).then(response => response.json()).then(jsonResponse => {
                if (jsonResponse.items) {
                    let playList = jsonResponse.items.find(element => {
                        return element.name === playListTitle;
                    });

                    if (playList && playList.id) {
                        return playList.id;
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    },

    getPlayListTracks(spotifyId, playListId) {
        if (spotifyId && playListId) {
            try {
                return Spotify.getAccessToken().then(() => {
                    let url = `https://api.spotify.com/v1/users/${spotifyId}/playlists/${playListId}/tracks`;
                    return fetch(url, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                }).then(response => response.json()).then(jsonResponse => {
                    if (jsonResponse.items) {
                        return jsonResponse.items.map(item => {
                                return {
                                    id: item.track.id,
                                    title: item.track.name,
                                    album: item.track.album.name,
                                    artist: item.track.artists[0].name,
                                    uri: item.track.uri,
                                    duration: Spotify.convertDuration(item.track.duration_ms),
                                    sampleUrl: item.track.preview_url
                                };
                        });
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    },

    createPlayList(spotifyId, playListTitle) {
        try {
            return Spotify.getAccessToken().then(() => {
                let url = `https://api.spotify.com/v1/users/${spotifyId}/playlists`;
                let data = {name: playListTitle, public: 'true'}
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-type': "application/json"
                    },
                    body: JSON.stringify(data)
                });
            }).then(response => response.json()).then(jsonResponse => {
                if (jsonResponse.id) {
                    return jsonResponse.id;
                }
            });
        } catch (error) {
            console.log(error);
        }
    },

    addTracksToPlayList(spotifyId, playListId, playList) {
        if (spotifyId && playListId && playList) {
            try {
                return Spotify.getAccessToken().then(() => {
                    let url = `https://api.spotify.com/v1/users/${spotifyId}/playlists/${playListId}/tracks`;
                    let data = {uris: []}
                    playList.forEach(track => data.uris.push(track.uri));
                    return fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-type': "application/json"
                        },
                        body: JSON.stringify(data)
                    });
                }).then(response => response.json()).then(jsonResponse => {
                    return jsonResponse;
                });
            } catch (error) {
                console.log(error);
            }
        }
    },

    loadPlayList(playListTitle) {
        return Spotify.getSpotifyId().then(spotifyId => {
            return Spotify.getPlayListId(spotifyId, playListTitle).then(playListId => {
                return Spotify.getPlayListTracks(spotifyId, playListId);
            });
        });
    },

    savePlayList(playListTitle, playList) {
        if (playListTitle && playList) {
            return Spotify.getSpotifyId().then(spotifyId => {
                return Spotify.createPlayList(spotifyId, playListTitle).then(playListId => {
                    return Spotify.addTracksToPlayList(spotifyId, playListId, playList);
                });
            });
        }
    },

    search(term) {
        try {
            return Spotify.getAccessToken().then(() => {
                return fetch(spotifySearchURL+term, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
            }).then(response => response.json()).then(jsonResponse => {
                console.log(jsonResponse);
                if (jsonResponse.tracks) {
                    return jsonResponse.tracks.items.map(track => {
                            return {
                                id: track.id,
                                title: track.name,
                                album: track.album.name,
                                artist: track.artists[0].name,
                                uri: track.uri,
                                duration: Spotify.convertDuration(track.duration_ms),
                                sampleUrl: track.preview_url
                            };
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

};
