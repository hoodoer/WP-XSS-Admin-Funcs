# WP-XSS-Admin-Funcs
JavaScript functions intended to be used as an XSS payload against a WordPress admin account. 


Only use this code for pentesting systems you're authorized to touch. Or I will be seriously grumpy in your general direction. 

Note that if you're uploading a plugin using this payload, your wordpress plugin zip file will need to be encoded and embedded in the JavaScript. See this converter:
https://github.com/hoodoer/javascriptFileEncoder


@hoodoer

There's a blog post writeup on weaponizing XSS payloads here:

https://www.trustedsec.com/blog/tricks-for-weaponizing-xss/

You can see a demo/webinar on how to go about developing code like this here:

https://youtu.be/NBWYRLnWDkM



Note that in the webinar I stated that you cannot control/set the 'Referer' header from your XSS payload. This is incorrect. 

You can set the referer using a simple trick, see this gist for an example:

https://gist.github.com/hoodoer/c4eb12b99d5902119fb30e8343b5b228

There's a blog post going over how to control the referer value using that code snippet here:

https://www.trustedsec.com/blog/setting-the-referer-header-using-javascript/



Working functions:

Add new administrator user

Exfiltrate wordpress site content export

Wordpress plugin installation

Automatically hide the malicous plugin after it's installed

Upload PHP meterpreter shell and execute


Next up: 

Disable WordFence? (work in progress)

Pop proper meterpreter shell (really, no one likes PHP meterpreter shells)?

Deactive plugin?

Delete plugin?
