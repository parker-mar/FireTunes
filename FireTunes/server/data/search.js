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
// Search for a specified string.
function search() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet'
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    $('#search-container').html('<pre>' + str + '</pre>');
  });
}
