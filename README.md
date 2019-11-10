# WP-XSS-Admin-Funcs
JavaScript functions intended to be used as an XSS payload against a WordPress admin account. 


Only use this code for pentesting systems you're authorized to touch. Or I will be seriously grumpy in your general direction. 

Note that if you're uploading a plugin using this payload, your wordpress plugin zip file will need to be encoded and embedded in the JavaScript. See this converter:
https://github.com/hoodoer/javascriptFileEncoder


@hoodoer

Working functions:

Add new administrator user

Exfiltrate wordpress site content export

Wordpress plugin installation

Automatically hide the malicous yertle plugin after it's installed

Next up: Pop shells?
