function musicNameToURL(beastName) {
  switch (beastName) {
    case "Youtube":
      return chrome.extension.getURL("icons/youtube.jpg");
    case "Pandora":
      return chrome.extension.getURL("icons/youtube.jpg");
    case "Spotify":
      return chrome.extension.getURL("icons/youtube.jpg");
  }
}

// document.addEventListener("click", function(e) {
//   if (!e.target.classList.contains("music")) {
//     return;
//   }

//   var chosenMusic = e.target.textContent;
//   var chosenMusicURL;
//   switch (chosenMusic) {
//     case "Youtube":
//       chosenMusicURL = "http://www.youtube.com";
//       break;
//     case "Pandora":
//       chosenMusicURL = "http://www.pandora.com";
//       break;
//     case "Spotify":
//       chosenMusicURL = "http://www.spotify.com";
//       break;
//   }
  
//   //window.location = chosenMusicURL;
//    chrome.tabs.create({ url: chosenMusicURL });
// });

function musicButton(channel) {
  switch (channel) {
    case "Youtube":
      console.log("Youtube");
      chosenMusicURL = "http://www.youtube.com";
      break;
    case "Pandora":
      console.log("Pandora");
      chosenMusicURL = "http://www.pandora.com";
      break;
    case "Spotify":
      console.log("Spotify");
      chosenMusicURL = "http://www.spotify.com";
      break;
  }
  window.location = chosenMusicURL;

}