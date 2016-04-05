googleApiClientReady = function() {
    console.log('inside apiclientready');
    //console.log(gapi.client.load('youtube', 'v3').then(handleAPILoaded));
    gapi.client.setApiKey('AIzaSyDGrhGmy9AGMxFv5pTiUAyxVFv-2W2T1rw');
    gapi.client.load('youtube', 'v3', function() {
        $('#search-button')
            .attr('disabled', false);
        console.log('after setting');
    });
}
var list = [];
var str = [];

function handleAPILoaded() {
    console.log('inside handleapiloaded');
}

function playvideo(e) {
    player.loadPlaylist(list, player.getPlaylistIndex());
}

function pausevideo(e) {
        player.pauseVideo();
    }
    // Search for a specified string.

function search() {
    var q = $('#query')
        .val();
    console.log(gapi.client.youtube);
    var request = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet',
        maxResuslts: 6
    });
    request.execute(function(response) {
        var str = '';
        for (var i = 0; i < response.items.length; i++) {
            str += '<tr><td>' + (i + 1) + ')' + response.items[i].snippet
                .title + '<img name="' + response.items[i].snippet.title +
                '"src="icons/addSong.png" id="' + response.items[i]
                .id.videoId +
                '" onclick="addToPlaylist(this)" style="width:15px;height:15px;"> ' +
                '</td></tr>';
        }
        $('#search-container')
            .html(
                '<table border="1" style="width:50%"><tr> <td> <b> Search Result </b></td></tr>' +
                str + '</table>');
    });
}
function nextSong (e) {
player.loadPlaylist(list, player.getPlaylistIndex()+1);
}
function previousSong (e) {
player.loadPlaylist(list, player.getPlaylistIndex()-1);
}
function addToPlaylist(e) {
    console.log(e.id);
    str.push('<tr id="' + e.id + '" ><td>' + e.name +
        '<img src="icons/deleteSong.png" onclick="deleteFromPlaylist(this)" style="width:15px;height:15px;"></td></tr>'
    );
    list.push(e.id);
    console.log(list);
    $('#playList')
        .html(
            '<table border="1" style="width:50%"> <tr> <td> <b>Current playlist </b> </td></tr>' +
            str.join(" ") + '</table>');
}

function deleteFromPlaylist(e) {
    console.log('inside delete');
    i = list.indexOf(e.id);
    str.splice(i, 1);
    list.splice(i, 1);
    $('#playList')
        .html(
            '<table border="1" style="width:50%"><tr> <td><b> Current playlist </b></td></tr>' +
            str.join(" ") + '</table>');
}