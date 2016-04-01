googleApiClientReady = function () {
   console.log('inside apiclientready');
   //console.log(gapi.client.load('youtube', 'v3').then(handleAPILoaded));
   gapi.client.setApiKey('AIzaSyDGrhGmy9AGMxFv5pTiUAyxVFv-2W2T1rw');
   gapi.client.load('youtube', 'v3', function () {
   $('#search-button').attr('disabled', false);
   console.log('after setting');
});
}
function handleAPILoaded() {
  console.log('inside handleapiloaded');

}
function playvideo (e) {
player.playVideo();
}
function pausevideo (e) {
player.pauseVideo();
}
// Search for a specified string.
function search() {
  var q = $('#query').val();
  console.log(gapi.client.youtube);
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet',
    maxResuslts: 6
  });

  request.execute(function(response) {
    var str = '';
    
    for ( var i=0;i<response.items.length;i++){
	str+='<tr id="' + response.items[i].id.videoId + '"><td>' + (i + 1) + ')' + response.items[i].snippet.title + '<img src="addSong.png" style="width:30px;height:30px;">' + '</td></tr>';
	}
    $('#search-container').html('<table border="1" style="width:100%">' + str + '</table>');
  });
}
function playVideo (e){
console.log(e.id);
player.loadVideoById(e.id);
player.playVideo();
}
