var { ActionButton } = require('sdk/ui/button/action');
var { ToggleButton } = require ('sdk/ui/button/toggle');
var { Toolbar } = require("sdk/ui/toolbar");
var { Frame } = require("sdk/ui/frame");
var button = ToggleButton({
	id: "my-button",
	label: "My button",
	icon: "./icons/youtube.png",
	onChange: handleChange
});
var panel = require("sdk/panel").Panel({
	width: 200,
	height: 100,
	contentURL: "http://amdt.ca/g6/search-frame.html",
	position: button
});

function handleChange (state) {
if (state.checked) {
panel.show();
}
}

function handleHide () {
button.state('window', {checked: false});
}


var toolbar = Toolbar({
  title: "Player",
  items: [button]
});
