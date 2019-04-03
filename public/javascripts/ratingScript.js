function check(event) {
	// Get Values
	var username  = document.getElementById('username' ).value;
	var rname    = document.getElementById('rname'   ).value;
	var aname    = document.getElementById('aname'   ).value;
	var comment = document.getElementById('comment').value;
    var score = document.getElementById('score').value;

	
	// Simple Check
	if(username.length == 0) {
		alert("Invalid username");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if(rname.length == 0) {
		alert("Invalid rname");
		event.preventDefault();
		event.stopPropagation();
		return false;
    }
    if(aname.length == 0) {
		alert("Invalid rname");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}