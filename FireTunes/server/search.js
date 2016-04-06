/* Authentication logic */

// Authenticate using the API key
googleApiClientReady = function() {
    console.log('googleApiClientReady');

    gapi.client.setApiKey('AIzaSyDGrhGmy9AGMxFv5pTiUAyxVFv-2W2T1rw');
    gapi.client.load('youtube', 'v3', function () {

        // Enable the search button only when authentication completes
        $('#search-button').attr('disabled', false);
    });
};


/* Playlist logic */
// https://developers.google.com/youtube/iframe_api_reference#Playback_controls
// TODO can't execute videos with ads and those not allowed outside of youtube (should show user error, or hide
// such videos from search menu).
// TODO make sure works on own computer.
// TODO volume slider based on percentage [player.setVolume(volume:Number):Void]


// IFrame API can't modify playlist, only replace it. So we have to keep track of our own.
// Assumption: The below data structures won't run into concurrency issues. Somewhat fair because operations are nimble.

// Pointer to current song, initialized to the first.
var playlistPointer = 0;

// Playlist of songs
var playlist = [];

// Playlist of songs (string)
var playlistStr = [];

// Play song pointed to in the playlist, or resume currently paused one.
function playSong(e) {
    if (player.getPlayerState() == YT.PlayerState.PAUSED) {
        player.playVideo();
    } else if (playlistPointer < playlist.length) {
        player.loadVideoById(playlist[playlistPointer]);
        player.playVideo();
    }
}

// Pause currently playing song, if any.
function pauseSong(e) {
    player.pauseVideo();
}

// Play next song, if any, including self (starts it from the beginning). Loops around.
function playNextSong(e) {
    if (playlist.length > 0) {
        playlistPointer = (playlistPointer + 1) % playlist.length;
        player.loadVideoById(playlist[playlistPointer]);
        player.playVideo();
    }
}

// Play previous song, if any, including self (starts it from the beginning). Loops around.
function playPreviousSong(e) {
    if (playlist.length > 0) {
        playlistPointer = (playlistPointer - 1 + playlist.length) % playlist.length;
        player.loadVideoById(playlist[playlistPointer]);
        player.playVideo();
    }
}

// Add song to playlist
function addToPlaylist(e) {
    console.log("addToPlaylist: " + e.id);

    // Update playlist, its string, and its pointer
    playlist.push(e.id);
    playlistStr.push('<tr id="' + e.id + '" ><td>' + e.name +
        '<img src="icons/deleteSong.png" onclick="deleteFromPlaylist(this)" style="width:15px;height:15px;"></td></tr>'
    );

    console.log("updated playlist:\n" + playlist);

    // Update UI
    $('#playList').html(
        '<table border="1" style="width:50%"> <tr> <td> <b>Current playlist </b> </td></tr>' +
        playlistStr.join(" ") + '</table>');
}

// Remove song from playlist
function deleteFromPlaylist(e) {
    console.log("deleteFromPlaylist: " + e.id);

    // Update playlist, its string, and its pointer
    i = playlist.indexOf(e.id);
    playlist.splice(i, 1);
    playlistStr.splice(i, 1);
    if (playlistPointer == i && playlist.length > 0) {
        // Then the currently playing song is removed: move the pointer to that of the previous song.
        // Shouldn't be here, though, if the song being removed is the last in the playlist.
        playlistPointer = (playlistPointer - 1 + playlist.length) % playlist.length;
    }

    console.log("updated playlist:\n" + playlist);

    // Update UI
    $('#playList').html(
        '<table border="1" style="width:50%"><tr> <td><b> Current playlist </b></td></tr>' +
        playlistStr.join(" ") + '</table>');
}


/* Player state change logic */

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        // Then the song is finished: just play the next song!
        playNextSong();
    }
}


/* Search logic */

function search() {
    console.log(gapi.client.youtube);

    // Prepare a search request
    var request = gapi.client.youtube.search.list({
        q: $('#query').val(),
        part: 'snippet',
        maxResuslts: 6
    });

    // Make a search request
    request.execute(function(response) {
        var str = '';

        for (var i = 0; i < response.items.length; i++) {
            str += '<tr><td>' + (i + 1) + ')' + response.items[i].snippet.title +
                '<img name="' + response.items[i].snippet.title +
                '"src="icons/addSong.png" id="' + response.items[i].id.videoId +
                '" onclick="addToPlaylist(this)" style="width:15px;height:15px;"> </td></tr>';
        }

        $('#search-container')
            .html('<table border="1" style="width:50%"><tr> <td> <b> Search Result </b></td></tr>' + str + '</table>');
    });
}