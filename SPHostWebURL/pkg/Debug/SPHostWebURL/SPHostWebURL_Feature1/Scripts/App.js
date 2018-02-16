'use strict';

var hostweburl;
var appweburl;

function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}

//HTTP403: PROIBIDO - o servidor compreendeu a solicitação, mas está se recusando a atendê-la.





$(document).ready(function () {
    //Get the URI decoded URLs.
    hostweburl =
        decodeURIComponent(
            getQueryStringParameter("SPHostUrl")
    );
    appweburl =
        decodeURIComponent(
            getQueryStringParameter("SPAppWebUrl")
    );
    // resources are in URLs in the form:
    // web_url/_layouts/15/resource
    var scriptbase = hostweburl + "/_layouts/15/";
    // Load the js files and continue to the successHandler
    $.getScript(scriptbase + "SP.RequestExecutor.js", execCrossDomainRequest);
});


function execCrossDomainRequest() {
    // executor: The RequestExecutor object
    // Initialize the RequestExecutor with the app web URL.
    var executor = new SP.RequestExecutor(appweburl);
    // Issue the call against the app web.
    // To get the title using REST we can hit the endpoint:
    //      appweburl/_api/web/lists/getbytitle('listname')/items
    // The response formats the data in the JSON format.
    // The functions successHandler and errorHandler attend the
    //      sucess and error events respectively.
    executor.executeAsync(
        {
            url: appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('CategoryList')/items?@target='" + hostweburl + "/CategoryList'&$top=4",
            
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: successHandler,
            error: errorHandler
        }
       
    );
}

function successHandler(data) {
  
    var jsonObject = JSON.parse(data.body);
    var ListInfo = "";
    var results = jsonObject.d.results;
    for (var i = 0; i < results.length; i++) {
        //blogsHTML = blogsHTML + "<div><a href=\"" + hostweburl + "/blog/Lists/Posts/Post.aspx?ID=" + results[i].ID + "\" target=\"_blank\">" + results[i].Title + "</a></div><br>";
        ListInfo = ListInfo + results[i].Title + '<br/>';
    }
    $('#internal').append(ListInfo);
}
// Function to handle the error event.
// Prints the error message to the page.
function errorHandler(data, errorCode, errorMessage) {
    document.getElementById("internal").innerText =
        "Could not complete cross-domain call: " + errorMessage;
}


/*var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    getUserName();
});

// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

// This function is executed if the above call is successful
// It replaces the contents of the 'message' element with the user name
function onGetUserNameSuccess() {
    $('#message').text('Hello ' + user.get_title());
}

// This function is executed if the above call fails
function onGetUserNameFail(sender, args) {
    alert('Failed to get user name. Error:' + args.get_message());
}
*/