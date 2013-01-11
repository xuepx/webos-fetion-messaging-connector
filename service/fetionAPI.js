if (typeof require === "undefined") {
  require = IMPORTS.require;
}

var http = require('http');
var qs = require('querystring');

var host = 'f.10086.cn';
var loginPath = '/im5/login/loginHtml5.action';
var cookiePath = '/im5/login/login.action';
var groupPath = '/im5/index/loadGroupContactsAjax.action';
var listPath = '/im5/index/contactlistView.action?fromUrl=&idContactList=%idContactList%';

var AjaxPost = function(host, path, params, cookies, callback) {
	var data = qs.stringify(params);
	var client = http.createClient(80, host);
	var headers;
	if (!!cookies) {
		headers = {
			'Host' : host,
			'Cookie' : cookies,
			'Content-Type' : 'application/json',
			'Content-Length' : Buffer.byteLength(data, 'utf8'),
			'Connection' : 'keep-alive',
			'User-Agent' : 'Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)'
		};
	} else {
		headers = {
			'Host' : host,
			'Content-Type' : 'application/json',
			'Content-Length' : Buffer.byteLength(data, 'utf8'),
			'Connection' : 'keep-alive',
			'User-Agent' : 'Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)'
		};
	}

	var request = client.request('POST', path + '?' + data, headers);
	var body = '';
	request.on('response', function(response) {
		response.on('data', function(chunk) {
			body += chunk;
		});
		response.on('end', function() {
			if (response.statusCode != 200) {
				if (!!callback) {
					if (typeof response.headers['set-cookie'] == 'object') {
						callback({
							returnValue : false,
							responseText : body,
							cookie : response.headers['set-cookie'][0]
						});
					} else {
						callback({
							returnValue : false,
							responseText : body,
							cookie : response.headers['set-cookie']
						});
					}
				}
				return false;
			}
			if (!!callback) {
				if (typeof response.headers['set-cookie'] == 'object') {
					callback({
						returnValue : true,
						responseText : body,
						cookie : response.headers['set-cookie'][0]
					});
				} else {
					callback({
						returnValue : true,
						responseText : body,
						cookie : response.headers['set-cookie']
					});
				}
			}
			return true;
		});
	});
	// you'd also want to listen for errors in production
	request.write(data);
	request.end();
}
var AjaxGet = function(host, path, cookies, callback) {
	var client = http.createClient(80, host);
	var headers;
	if (!!cookies) {
		headers = {
			'Host' : host,
			'Cookie' : cookies,
			'Content-Type' : 'application/json',
			'Connection' : 'keep-alive',
			'User-Agent' : 'Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)'
		};
	} else {
		headers = {
			'Host' : host,
			'Content-Type' : 'application/json',
			'Connection' : 'keep-alive',
			'User-Agent' : 'Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)'
		};
	}
	var request = client.request('GET', path, headers);
	var body = '';
	request.on('response', function(response) {
		response.on('data', function(chunk) {
			body += chunk;
		});
		response.on('end', function() {
			if (response.statusCode != 200) {
				if (!!callback) {
					if (typeof response.headers['set-cookie'] == 'object') {
						callback({
							returnValue : false,
							responseText : body,
							cookie : response.headers['set-cookie'][0]
						});
					} else {
						callback({
							returnValue : false,
							responseText : body,
							cookie : response.headers['set-cookie']
						});
					}
				}
				return false;
			}
			if (!!callback) {
				if (typeof response.headers['set-cookie'] == 'object') {
					callback({
						returnValue : true,
						responseText : body,
						cookie : response.headers['set-cookie'][0]
					});
				} else {
					callback({
						returnValue : true,
						responseText : body,
						cookie : response.headers['set-cookie']
					});
				}
				return true;
			}
		});
	});
	request.end();
}

var fetionLogin = function(username, password, callback) {
	AjaxGet(host, cookiePath, null, function(inResponse) {
		if (!inResponse.cookie) {
			if (!!callback) {
				callback({
					resultValue : false,
					responseText : 'cookie NOT Found',
					cookies : ''
				});
			}
			return false;
		}
		var cookies = [ inResponse.cookie.split(";")[0] ];
		AjaxGet(host, cookiePath, cookies.join("; "), function(inResponse1) {
			if (!inResponse1.cookie) {
				if (!!callback) {
					callback({
						resultValue : false,
						responseText : 'cookie NOT Found',
						cookies : ''
					});
				}
				return false;
			}
			cookies.push(inResponse1.cookie.split(";")[0]);
			var params = {
				'm' : username,
				'pass' : password
			};
			AjaxPost(host, loginPath, params, cookies.join("; "), function(
					inResponse2) {
				if (!inResponse2.cookie) {
					if (!!callback) {
						callback({
							resultValue : false,
							responseText : 'Login Failure',
							cookies : ''
						});
					}
					return false;
				}
				cookies.push(inResponse2.cookie.split(";")[0]);
				if (!!callback) {
					callback({
						resultValue : true,
						responseText : inResponse2.responseText,
						cookies : cookies
					});
					return true;
				}
			});
		});
	})
}
var getFetionGroup = function(cookies, callback) {
	if (!cookies) {
		if (!!callback) {
			callback({
				resultValue : false,
				groupList : []
			});
		}
		return false;
	}
	AjaxGet(host, groupPath, cookies, function(inResponse) {
		console.log('responseText', inResponse.responseText);
	});
}
var getFetionList = function(cookies, idCantactList, callback) {
	if (!cookies) {
		if (!!callback) {
			callback({
				resultValue : false,
				groupList : []
			});
		}
		return false;
	}
	AjaxGet(host, listPath.replace(/%idContactList%/,idCantactList), cookies, function(inResponse) {
		console.log('responseText', inResponse.responseText);
	});
}

//fetionLogin('13000000000', 'password', function(inResponse) {
//	console.log(inResponse);
//	getFetionGroup(inResponse.cookies.join(";"), function(inResponse2) {
//		console.log(inResponse2);
//	})
//	getFetionList(inResponse.cookies.join(";"),3, function(inResponse2) {
//		console.log(inResponse2);
//	})
//})
