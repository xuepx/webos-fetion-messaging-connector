if (typeof require === "undefined") {
    require = IMPORTS.require;
}

var http = require("http");
var qs = require("querystring");
var fs = require('fs');

var log=function(msg){
    var now=new Date();
    fs.open("/media/internal/fetion.log","a",0644,function(e,fd){
        if(e) throw e;
        fs.write(fd,now.toUTCString()+msg+"\n",function(e){
            if(e) throw e;
            fs.closeSync(fd);
        })
    });
    //fs.writeFileSync("/media/internal/fetion.log", now.toUTCString()+msg, encoding='utf8');
}

var host = 'f.10086.cn';
var loginPath = '/im5/login/loginHtml5.action';
var cookiePath = '/im5/login/login.action';
var groupPath = '/im5/index/loadGroupContactsAjax.action';
var listPath = '/im5/index/contactlistView.action?fromUrl=&idContactList=%idContactList%';
var newmsgPath = '/im5/box/alllist.action';
var readmsgPath = '/im5/chat/queryNewMsg.action?idMsgs=%idMsgs%';
var sendmsgPath = '/im5/chat/sendNewMsg.action';
var getIdPath = "/im5/user/searchFriendByPhone.action?number=%mobile%";
var addFriendPath = "/im5/user/searchFriendByPhone.action?number=%mobile%";

var AjaxPost = function (host, path, params, cookies, callback) {
    var data = qs.stringify(params);
    var client = http.createClient(80, host);
    var headers;
    if (!!cookies) {
        headers = {
            'Host':host,
            'Cookie':cookies,
            'Content-Type':'application/json',
            'Content-Length':Buffer.byteLength(data, 'utf8'),
            'Connection':'keep-alive',
            'User-Agent':'Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)'
        };
    } else {
        headers = {
            'Host':host,
            'Content-Type':'application/json',
            'Content-Length':Buffer.byteLength(data, 'utf8'),
            'Connection':'keep-alive',
            'User-Agent':'Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)'
        };
    }

    var request = client.request('POST', path + '?' + data, headers);
    var body = '';
    request.on('response', function (response) {
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            if (response.statusCode != 200) {
                if (!!callback) {
                    if (typeof response.headers['set-cookie'] == 'object') {
                        callback({
                            returnValue:false,
                            responseText:body,
                            cookie:response.headers['set-cookie'][0]
                        });
                    } else {
                        callback({
                            returnValue:false,
                            responseText:body,
                            cookie:response.headers['set-cookie']
                        });
                    }
                }
                return false;
            }
            if (!!callback) {
                if (typeof response.headers['set-cookie'] == 'object') {
                    callback({
                        returnValue:true,
                        responseText:body,
                        cookie:response.headers['set-cookie'][0]
                    });
                } else {
                    callback({
                        returnValue:true,
                        responseText:body,
                        cookie:response.headers['set-cookie']
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
var AjaxGet = function (host, path, cookies, callback) {
    var client = http.createClient(80, host);
    var headers;
    if (!!cookies) {
        headers = {
            'Host':host,
            'Cookie':cookies,
            'Content-Type':'application/json',
            'Connection':'keep-alive',
            'User-Agent':'Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)'
        };
    } else {
        headers = {
            'Host':host,
            'Content-Type':'application/json',
            'Connection':'keep-alive',
            'User-Agent':'Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)'
        };
    }
    var request = client.request('GET', path, headers);
    var body = '';
    request.on('response', function (response) {
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            if (response.statusCode != 200) {
                if (!!callback) {
                    if (typeof response.headers['set-cookie'] == 'object') {
                        callback({
                            returnValue:false,
                            responseText:body,
                            cookie:response.headers['set-cookie'][0]
                        });
                    } else {
                        callback({
                            returnValue:false,
                            responseText:body,
                            cookie:response.headers['set-cookie']
                        });
                    }
                }
                return false;
            }
            if (!!callback) {
                if (typeof response.headers['set-cookie'] == 'object') {
                    callback({
                        returnValue:true,
                        responseText:body,
                        cookie:response.headers['set-cookie'][0]
                    });
                } else {
                    callback({
                        returnValue:true,
                        responseText:body,
                        cookie:response.headers['set-cookie']
                    });
                }
                return true;
            }
        });
    });
    request.end();
}
var fetionLogin = function (username, password, callback) {
    AjaxGet(host, cookiePath, null, function (inResponse) {
        if (!inResponse.cookie) {
            if (!!callback) {
                callback({
                    returnValue:false,
                    responseText:'cookie NOT Found',
                    cookies:''
                });
            }
            log(" Login Failure: cookie NOT Found");
            return false;
        }
        var cookies = [ inResponse.cookie.split(";")[0] ];
        AjaxGet(host, cookiePath, cookies.join("; "), function (inResponse1) {
            if (!inResponse1.cookie) {
                if (!!callback) {
                    callback({
                        returnValue:false,
                        responseText:'cookie NOT Found',
                        cookies:''
                    });
                }
                log(" Login Failure: cookie NOT Found");
                return false;
            }
            cookies.push(inResponse1.cookie.split(";")[0]);
            var params = {
                'm':username,
                'pass':password
            };
            AjaxPost(host, loginPath, params, cookies.join("; "), function (inResponse2) {
                if (!inResponse2.cookie) {
                    if (!!callback) {
                        callback({
                            returnValue:false,
                            responseText:'Login Failure',
                            cookies:''
                        });
                    }
                    log(" Login Failure: "+inResponse.responseText);
                    return false;
                }
                cookies.push(inResponse2.cookie.split(";")[0]);
                if (!!callback) {
                    callback({
                        returnValue:true,
                        responseText:inResponse2.responseText,
                        cookies:cookies
                    });
                    log(" Login Success: "+inResponse.responseText);
                    return true;
                }
            });
        });
    })
}
var getFetionList = function (cookies, idCantactList, callback) {
    if (!cookies) {
        if (!!callback) {
            callback({
                returnValue:false,
                groupList:[]
            });
        }
        return false;
    }
    AjaxGet(host, listPath.replace(/%idContactList%/, idCantactList), cookies, function (inResponse) {
        if (inResponse.returnValue === false) {
            if (!!callback) {
                callback({
                    returnValue:false,
                    contactList:[1]
                });
            }
            return false;
        }
        if (!!callback) {
            callback({
                returnValue:true,
                contactList:JSON.parse(inResponse.responseText)
            });
        }
        return true;
    });
}
var getFetionGroup = function (cookies, callback) {
    if (!cookies) {
        if (!!callback) {
            callback({
                returnValue:false,
                group:[]
            });
        }
        return false;
    }
    AjaxGet(host, groupPath, cookies, function (inResponse) {
        if (!inResponse.returnValue) {
            if (!!callback) {
                callback({returnValue:false, group:[]});
            }
            return false;
        }
        if (!!callback) {
            callback({returnValue:true, group:JSON.parse(inResponse.responseText)});
        }
        return true;
    });
}
var getAllContact = function (cookies, callback) {
    if (!cookies) {
        if (!!callback) {
            callback({
                returnValue:false,
                allContactList:[]
            });
        }
        return false;
    }
    getFetionGroup(cookies, function (inResponse) {
        if (inResponse.returnValue === false) {
            if (!!callback) {
                callback({returnValue:false, allContactList:{}});
            }
            return false;
        }
//        console.log(inResponse.group);
        var group = inResponse.group.contacts;
        var loaded = 0;
        var allContacts = [];
        for (var k = 0; k < group.length; k++) {
            getFetionList(cookies, group[k].idContactList, function (inResponse2) {
                loaded++;
                if (inResponse2.returnValue === true) {
                    var contacts = inResponse2.contactList.contacts;
                    for (var m = 0; m < contacts.length; m++) {
                        allContacts.push(contacts[m]);
                    }
                }
                if (loaded == group.length) {
                    if (!!callback) {
                        callback({
                            returnValue:true,
                            allContactList:allContacts
                        });
                    }
                    return true;
                }
            });
        }
    })
}
var getNewMsg = function (cookies, callback) {
    if (!cookies) {
        if (!!callback) {
            callback({
                returnValue:false,
                newmsg:[]
            });
        }
        return false;
    }
    AjaxGet(host, cookiePath, cookies, function (inResponse0) {
//        callback({returnValue:false, newmsg:inResponse0});
//        return;
        AjaxPost(host, newmsgPath, {}, cookies, function (inResponse) {
            if (inResponse.returnValue==="") {
                if (!!callback) {
                    callback({returnValue:false, newmsg:[]});
                }
                return false;
            }
            if (!!callback) {
                try {
                    callback({returnValue:true, newmsg:JSON.parse(inResponse.responseText).chat_messages});
                } catch (err) {
                    callback({returnValue:true, newmsg:[]});
                }
            }
            return true;
        });
    });
}
var readMsgs = function (cookies, idMsgs, callback) {
    if (!cookies) {
        if (!!callback) {
            callback({
                returnValue:false
            });
        }
        return false;
    }
    console.log(readmsgPath.replace(/%idMsgs%/, idMsgs.join(",")))
    AjaxGet(host, readmsgPath.replace(/%idMsgs%/, idMsgs.join(",")), cookies, function (inResponse) {
        console.log(inResponse.responseText);
        if (!inResponse.returnValue) {
            if (!!callback) {
                callback({returnValue:false});
            }
            return false;
        }
        if (!!callback) {
            callback({returnValue:true});
        }
        return true;
    });
}
var sendMsgbyId = function (cookies, idContact, msg, callback) {
    if (!cookies) {
        if (!!callback) {
            callback({
                returnValue:false,
                cookie:cookies
            });
        }
        log(" Send Msg Failure: No cookie");
        return false;
    }
    var params = {
        'touserid':idContact,
        'msg':msg
//        'csrfToken':''
    }
    AjaxGet(host, cookiePath, cookies, function (inResponse0) {
//        if (!!inResponse.cookie) {//JSESSIONID outdate
//            var cookieList = cookies.split(";");
//            cookieList[1] = inResponse.cookie;
//            cookies = cookieList.join(";");
//        }
        AjaxPost(host, sendmsgPath, params, cookies, function (inResponse) {
            log("send Msg: "+inResponse.responseText);
            if (inResponse.returnValue === false) {
                if (!!callback) {
                    callback({
                        returnValue:false,
                        responseText:"error:" + inResponse.responseText
                    });
                }
                log(" Send Msg Failure: "+inResponse.responseText);
                return false;
            }
            if (JSON.parse(inResponse.responseText).sendCode === "true") {
                if (!!callback) {
                    callback({
                        returnValue:true,
                        responseText:"success:" + inResponse.responseText
                    });
                    log(" Send Msg Success: "+inResponse.responseText);
                }
            } else {
                if (!!callback) {
                    callback({
                        returnValue:false,
                        responseText:"error:" +inResponse.responseText
                    });
                    log(" Send Msg Success: "+inResponse.responseText);
                }
            }
            return true;
        });
    });
}
var sendMsg = function (cookies, mobile, msg, callback) {
    if (!cookies) {
        if (!!callback) {
            callback({
                returnValue:false
            });
        }
        log(" Send Msg Failure : No cookies");
        return false;
    }
    var mobilereg = /^(((13[0-9]{1})|15[0-9]{1}|18[0-9]{1}|)+\d{8})$/;
    if (!mobilereg.test(mobile)) {
        sendMsgbyId(cookies, mobile, msg, function (inResponse3) {
            if (inResponse3.returnValue === false) {
                if (!!callback) {
                    callback({
                        returnValue:false,
                        responseText:"Error:" + inResponse3.responseText
                    });
                }
                return false;
            }
            if (!!callback) {
                callback({
                    returnValue:true,
                    responseText:inResponse3.responseText
                });
            }
            return true;
        });
    }
    getIdContact(cookies, mobile, function (inResponse) {
        if (inResponse.returnValue === false) {
            if (!!callback) {
                callback({
                    returnValue:false,
                    responseText:"getId error"
                });
            }
            return false;
        }
        sendMsgbyId(cookies, inResponse.idContact, msg, function (inResponse2) {
            if (inResponse2.returnValue === false) {
                if (!!callback) {
                    callback({
                        returnValue:false,
                        responseText:"send to " + inResponse.idContact + " error"
                    });
                }
                return false;
            }
            if (!!callback) {
                callback({
                    returnValue:true,
                    responseText:inResponse.responseText
                });
            }
            return true;
        });
    })
}
var getIdContact = function (cookies, mobile, callback) {
    if (!cookies) {
        if (!!callback) {
            callback({
                returnValue:false,
                idContact:''
            });
        }
        return false;
    }
    AjaxGet(host, cookiePath, cookies, function (inResponse0) {
        AjaxGet(host, getIdPath.replace(/%mobile%/, mobile), cookies, function (inResponse) {
            if (inResponse.returnValue === false) {
                if (!!callback) {
                    callback({
                        returnValue:false,
                        idContact:''
                    });
                }
            }
            if (!!callback) {
                callback({
                    returnValue:true,
                    idContact:JSON.parse(inResponse.responseText).userinfo.idUser
                });
            }
        });
    });
}
var addFriend = function (cookies, mobile, callback) {
    if (!cookies) {
        if (!!callback) {
            callback({
                returnValue:false,
                type:''
            });
        }
        return false;
    }
    AjaxGet(host, getIdPath.replace(/%mobile%/, mobile), cookies, function (inResponse) {
        if (inResponse.returnValue === false) {
            if (!!callback) {
                callback({
                    returnValue:false,
                    type:''
                });
            }
        }
        if (!!callback) {
            callback({
                returnValue:true,
                type:JSON.parse(inResponse.responseText).type
            });
        }
    });
}