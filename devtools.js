var srcWithCookies = [];
var cacheWithCookies = [];
var runCount = 2;

Array.prototype.in_array = function(e) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == e) {
            return true;
        }
    }
    return false;
}

function getReferer(request) {
    var headers = request.request.headers;
    for (var i = 0; i < headers.length; i++) {
        if (headers[i].name == "referer")
            return headers[i].value;
    }
    return null;
}

chrome.devtools.panels.create("ColdFire", "coldfusion10.png", "panel.html", function(panel) {
    console.log('hello from callback');

});


chrome.devtools.network.onRequestFinished.addListener(function(request){
    console.log('------request finished------');
    var mediaType = request.response.content.mimeType;
    if (mediaType == 'text/javascript' || mediaType == 'application/javascript' || mediaType == 'application/x-javascript') {
        var reqUrl = request.request.url;
        var reqReferer = getReferer(request);
        if (!srcWithCookies.in_array(reqUrl)) {
            srcWithCookies[srcWithCookies.length] = reqUrl;
            request.getContent(function(content, encoding) {
                if (encoding == "") {
                    //console.log(content);
                    console.log(reqUrl);
                }
                cacheWithCookies[reqUrl] = content;
                //console.log(cacheWithCookies);
                var senddata = {"referer": reqReferer, "url": reqUrl, "content": content, "encoding": encoding};
                var xhr = new XMLHttpRequest();
                xhr.open("POST", 'http://localhost:8080/JSIndicator/index.jsp');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function() {
                    console.log('yes');
                }
                xhr.send(JSON.stringify(senddata));
            });
        }
    }
});

/*
chrome.devtools.network.onRequestFinished.addListener(function(request){
    console.log('------request finished------');
    chrome.devtools.network.getHAR(function(result){
        if (runCount > 0) {
            var entries = result.entries;
            for (var i = 0; i < entries.length; i++) {
                var url = entries[i].request.url;
                var mime = entries[i].response.content.mimeType;
                entries[i].getContent(function(content, encoding){
                    cacheWithCookies[entries[i].request.url] = content;
                    console.log(cacheWithCookies);
                });
            }
            runCount--;
        }
    });
});
*/
