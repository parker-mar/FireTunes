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

//
///* Too late:  type 2 (using yt data api for playlists) */
//// Create a private playlist.
//var request = gapi.client.youtube.playlists.insert({
//    part: 'snippet,status',
//    resource: {
//        snippet: {
//            title: 'Test Playlist',
//            description: 'A private playlist created with the YouTube API'
//        },
//        status: {
//            privacyStatus: 'private'
//        }
//    }
//});
//
//function playSong(e) {
//    player.playVideo();
//}
//
//function pauseSong(e) {
//    player.pauseVideo();
//}
//
//function playNextSong(e) {
//    player.nextVideo();
//}
//
//function playPreviousSong(e) {
//    player.previousVideo()
//}
//
//function addToPlaylist(id) {
//    var details = {
//        videoId: id,
//        kind: 'youtube#video'
//    };
//    var request = gapi.client.youtube.playlistItems.insert({
//        part: 'snippet',
//        resource: {
//            snippet: {
//                playlistId: playlistId,
//                resourceId: details
//            }
//        }
//    });
//
//    playlistStr.push('<tr id="' + id + '" ><td>' + e.name +
//            //'<img src="icons/deleteSong.png" onclick="deleteFromPlaylist(this)" style="width:15px;height:15px;"></td></tr>'
//        '<img src="icons/deleteSong.png" onclick="deleteFromPlaylist(' + this + ')" style="width:15px;height:15px;"></td></tr>'
//    );
//}
//
//// Remove song from playlist
//function deleteFromPlaylist(e) {
//    var request = gapi.client.youtube.playlistItems.delete({
//        part: 'snippet',
//        resource: {
//            snippet: {
//                playlistId: playlistId,
//                resourceId: details
//            }
//        }
//    });
//
//    console.log("deleteFromPlaylist2: " + e);
//    console.log("deleteFromPlaylist: " + e + e.id);
//
//    // Update playlist, its string, and its pointer
//    i = playlist.indexOf(e.id.videoId);
//    playlist.splice(i, 1);
//    playlistStr.splice(i, 1);
//    if (playlistPointer == i && playlist.length > 0) {
//        // Then the currently playing song is removed: move the pointer to that of the previous song.
//        // Shouldn't be here, though, if the song being removed is the last in the playlist.
//        playlistPointer = (playlistPointer - 1 + playlist.length) % playlist.length;
//    }
//
//    console.log("updated playlist:\n" + playlist);
//
//    // Update UI
//    $('#playList').html(
//        '<table border="1" style="width:50%"><tr> <td><b> Current playlist </b></td></tr>' +
//        playlistStr.join(" ") + '</table>');
//}
//
///* Search logic */
//
//function search() {
//    console.log(gapi.client.youtube);
//
//    // Prepare a search request
//    var request = gapi.client.youtube.search.list({
//        q: $('#query').val(),
//        part: 'snippet',
//        maxResuslts: 6
//    });
//
//    // Make a search request
//    request.execute(function(response) {
//        var str = '';
//
//        for (var i = 0; i < response.items.length; i++) {
//            str += '<tr><td>' + (i + 1) + ')' + response.items[i].snippet.title +
//                '<img name="' + response.items[i].snippet.title +
//                '"src="icons/addSong.png" id="' + response.items[i].id.videoId +
//                '" onclick="addToPlaylist(this)" style="width:15px;height:15px;"> </td></tr>';
//        }
//
//        $('#search-container')
//            .html('<table border="1" style="width:50%"><tr> <td> <b> Search Result </b></td></tr>' + str + '</table>');
//    });
//}



/* Playlist logic */
// https://developers.google.com/youtube/iframe_api_reference#Playback_controls
// Note: can't execute videos with ads and those not allowed outside of youtube (should show user error, or hide
// such videos from search menu). -> Can explain this as imporvement, and use internal playlist instead.
// Note: make sure works on own computer (but will just demo online).
// Note: can't deal with concurrency issues between event handler action and user action, unless use youtube data API
// as attempted above.

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
	$("#playList-" + playlist[playlistPointer]).css("background-color", "white");
        player.loadVideoById(playlist[playlistPointer]);
	$("#playList-" + playlist[playlistPointer]).css("background-color", "aqua");
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
	$("#playList-" + playlist[playlistPointer]).css("background-color", "white");
        playlistPointer = (playlistPointer + 1) % playlist.length;
	$("#playList-" + playlist[playlistPointer]).css("background-color", "aqua");
        player.loadVideoById(playlist[playlistPointer]);
        player.playVideo();
    }
}

// Play previous song, if any, including self (starts it from the beginning). Loops around.
function playPreviousSong(e) {
    if (playlist.length > 0) {
	$("#playList-" + playlist[playlistPointer]).css("background-color", "white");
        playlistPointer = (playlistPointer - 1 + playlist.length) % playlist.length;
	$("#playList-" + playlist[playlistPointer]).css("background-color", "aqua");
        player.loadVideoById(playlist[playlistPointer]);
        player.playVideo();
    }
}

// Add song to playlist
function addToPlaylist(e) {
    console.log("addToPlaylist: " + e.id);

    // Update playlist, its string, and its pointer
    playlist.push(e.id);
    // If playlist was empty, and new song was added, start playing that song
    if (playlist.length == 1) {
	player.loadVideoById(playlist[playlistPointer]);
        player.playVideo();
    }
    playlistStr.push('<tr id="playList-' + e.id + '"><td>' + e.name +
        //'<img src="icons/deleteSong.png" onclick="deleteFromPlaylist(this)" style="width:15px;height:15px;"></td></tr>'
        '</td><td align="center"><img src="icons/deleteSong.png" id="' + e.id + '" onclick="deleteFromPlaylist(this)" style="width:25px;height:25px;"></td></tr>'
    );

    console.log("updated playlist:\n" + playlist);

    // Update UI
    $('#playList').html(
        '<table border="1" width="100%"><col width="93%"><col width="7%"> <tr> <td colspan="2"> <b>Current playlist </b> </td></tr>' +
        playlistStr.join(" ") + '</table>');
    $("#playList-" + playlist[playlistPointer]).css("background-color", "aqua");
}

// Remove song from playlist
function deleteFromPlaylist(e) {
    console.log("deleteFromPlaylist2: " + e.id);
    // If it's the last song, stop playing
    if (playlist.length == 1) {	
	player.pauseVideo();
    }
    // Update playlist, its string, and its pointer
    i = playlist.indexOf(e.id);
    playlist.splice(i, 1);
    playlistStr.splice(i, 1);
    if (playlist.length > 0 && i <= playlistPointer) {
        // Then the currently playing song is removed: move the pointer to that of the previous song.
        // Shouldn't be here, though, if the song being removed is the last in the playlist.
        playlistPointer = (playlistPointer - 1 + playlist.length) % playlist.length;	
	// If the current playing song is the deleted song, play the previous song. rgb(0, 255, 255) is aqua	
	if ($("#playList-" + e.id).css("background-color") == "rgb(0, 255, 255)") {
	    player.loadVideoById(playlist[playlistPointer]);
            player.playVideo();
	}
    }

    console.log("updated playlist:\n" + playlist);

    // Update UI
    $('#playList').html(
        '<table border="1" style="width:100%"><col width="93%"><col width="7%"><tr> <td colspan="2"><b> Current playlist </b></td></tr>' +
        playlistStr.join(" ") + '</table>');
    $("#playList-" + playlist[playlistPointer]).css("background-color", "aqua");
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
            str += '<tr><td><img src="' + response.items[i].snippet.thumbnails.default.url + '"></td><td><b>' + (i + 1) + ')</b> ' + response.items[i].snippet.title + 
		'</br> Uploaded by:' + response.items[i].snippet.channelTitle + '</br> Upload date: ' + response.items[i].snippet.publishedAt + ' </td>' + 
                '<td align="center"><img name="' + response.items[i].snippet.title +
                '"src="icons/addSong.png" id="' + response.items[i].id.videoId + 
                '" onclick="addToPlaylist(this)" style="width:40px;height:40px;"></td></tr>';
        }

        $('#search-container')
            .html('<table border="1" style="width:100%"><col width="20%"><col width="70%"><col width="10%"><tr> <td colspan="3"> <b> Search Result </b></td></tr>' + str + '</table>');
    });
}


/* Volume control logic */

//TODO set initial slider button and tooltip to player.getVolume();

// http://jsfiddle.net/LucP/BPdKR/2/
(function ($) {

    var PPSliderClass = function (el, opts) {
        var element = $(el);
        var options = opts;
        var isMouseDown = false;
        var currentVal = 0;

        element.wrap('<div/>')
        var container = $(el).parent();

        container.addClass('pp-slider');
        container.addClass('clearfix');

        container.append('<div class="pp-slider-min">-</div><div class="pp-slider-scale"><div class="pp-slider-button"><div class="pp-slider-divies"></div></div><div class="pp-slider-tooltip"></div></div><div class="pp-slider-max">+</div>');

        if (typeof(options) != 'undefined' && typeof(options.hideTooltip) != 'undefined' && options.hideTooltip == true)
        {
            container.find('.pp-slider-tooltip').hide();
        }

        if (typeof(options.width) != 'undefined')
        {
            container.css('width',(options.width+'px'));
        }
        container.find('.pp-slider-scale').css('width',(container.width()-30)+'px');

        var startSlide = function (e) {

            isMouseDown = true;
            var pos = getMousePosition(e);
            startMouseX = pos.x;

            lastElemLeft = ($(this).offset().left - $(this).parent().offset().left);
            updatePosition(e);

            return false;
        };

        var getMousePosition = function (e) {
            //container.animate({ scrollTop: rowHeight }, options.scrollSpeed, 'linear', ScrollComplete());
            var posx = 0;
            var posy = 0;

            if (!e) var e = window.event;

            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            }
            else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
            }

            return { 'x': posx, 'y': posy };
        };

        var updatePosition = function (e) {
            var pos = getMousePosition(e);

            var spanX = (pos.x - startMouseX);

            var newPos = (lastElemLeft + spanX)
            var upperBound = (container.find('.pp-slider-scale').width()-container.find('.pp-slider-button').width());
            newPos = Math.max(0,newPos);
            newPos = Math.min(newPos,upperBound);
            currentVal = Math.round((newPos/upperBound)*100,0);

            player.setVolume(currentVal);

            container.find('.pp-slider-button').css("left", newPos);
            container.find('.pp-slider-tooltip').html(currentVal+'%');
            container.find('.pp-slider-tooltip').css('left', newPos-6);
        };

        var moving = function (e) {
            if(isMouseDown){
                updatePosition(e);
                return false;
            }
        };

        var dropCallback = function (e) {
            isMouseDown = false;
            element.val(currentVal);
            if(typeof element.options != 'undefined' && typeof element.options.onChanged == 'function'){
                element.options.onChanged.call(this, null);
            }

        };

        container.find('.pp-slider-button').bind('mousedown',startSlide);

        $(document).mousemove(function(e) { moving(e); });
        $(document).mouseup(function(e){ dropCallback(e); });

    };

    /*******************************************************************************************************/

    $.fn.PPSlider = function (options) {
        var opts = $.extend({}, $.fn.PPSlider.defaults, options);

        return this.each(function () {
            new PPSliderClass($(this), opts);
        });
    }

    $.fn.PPSlider.defaults = {
        width: 150
    };


})(jQuery);


$("#slider1").PPSlider({width: 100});
