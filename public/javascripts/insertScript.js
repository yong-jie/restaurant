function check(event) {
	// Get Values
	var username  = document.getElementById('username' ).value;
	var rname    = document.getElementById('rname'   ).value;
	var numPax = document.getElementById('numPax').value;
	var amount = document.getElementById('amount').value;
	var startTime = document.getElementById('startTime').value;
	var endTime = document.getElementById('endTime').value;
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
	if (startTime<=0 | startTime%100>=60) {
		alert("Start time must be between 0000 and 2359");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if (endTime<=1 | endTime%100>=60) {
		alert("End time must be between 0001 and 2359");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
	if (endTime<=startTime) {
		alert("End time cannot be earlier than Start time!");
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}