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
	str+='<b class="results" onclick="playVideo(this)" id="'+response.items[i].id.videoId +'">'+(i+1)+')  '+ response.items[i].snippet.title+'  ||    </b> ';
}
    $('#search-container').html('<marquee>' + str + '</marquee>');
  });
}
function playVideo (e){
console.log(e.id);
player.loadVideoById(e.id);
player.playVideo();
}
