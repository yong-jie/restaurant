function check(event) {
	// Get Values
	var username  = document.getElementById('username' ).value;
	var rname    = document.getElementById('rname'   ).value;
	var numPax = document.getElementById('numPax').value;
	var amount = document.getElementById('amount').value;
	var DateTime = document.getElementById('DateTime').value;
	//regex for currency
	var regex  = /^\d+(?:\.\d{0,2})$/;
	
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
	if(numPax <= 0) {
		alert("Invalid number of people");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if (!regex.test(amount)) {
		alert("Invalid amount");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}