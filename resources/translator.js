/**
 * Created by Gladkov Kirill on 12/15/2016.
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    console.log("get cookies func");
    return "";
}

if (getCookie("lang")=="")
{
    document.cookie = "lang=en";
}
// alert(document.cookie);

function setCookie(lng) {
    document.cookie = "lang=" + lng;
    console.log("set cookie func");
    location.reload();
}

function onLoadFunc() {
    var langsElems = document.getElementsByClassName("lang");
    for (var i = 0; i < langsElems.length; i++) {
        langsElems[i].innerHTML = getString(langsElems[i].id);
        console.log(langsElems[i]);
    }
}

function getString(string) {
    var result = "";
    var lang = getCookie("lang");
    switch (getCookie("lang")) {
        case 'HE':
            result = he[string];
            break;
        default:
            result = en[string];
            break;
    }
    console.log("get string func");
    return result;
}


var en = {
    welcome:'Welcome to',
    password:'password',
    loginToContinue: 'Please log in to continue'
};

var he = {
    welcome:'ברוכים הבאים',
    password:'פארול',
    loginToContinue: 'נא להזין להמשיך'
};