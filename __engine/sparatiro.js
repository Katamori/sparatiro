
// may help: https://gist.github.com/jbroadway/2836900
const acceptedBodyCharacters = "a-zA-Z0-9 ,.;\<\>='\"!";
const regex = {
    "lorem": [ 
        "lorem-ipsum", 
        "aaaaaaaaaaaaaaaaa" ],
    "quote": [
        "> ([" + acceptedBodyCharacters + "]*)",
        "<blockquote>$1</blockquote><br>" ],
    "bold": [ 
        "[_*]{2}([" + acceptedBodyCharacters + "]*)[_*]{2}", 
        "<b>$1</b>" ],
    "italic": [ 
        "[_*]{1}([" + acceptedBodyCharacters + "]*)[_*]{1}", 
        "<i>$1</i>" ],
    "underscore": [ 
        "/* todo */", 
        "/* todo */" ],
    "strikethrough": [ 
        "/* todo */", 
        "/* todo */" ],
    "interlink": [ 
        "/* todo */", 
        "/* todo */" ],
    "outerlink": [ 
        "/* todo */", 
        "/* todo */" ],
    "list": [ 
        "/* todo */", 
        "/* todo */" ],
    "header": [ 
        "([#]{1,6}) ([" + acceptedBodyCharacters + "]*)",
        (p1, p2, p3) => `<h${p2.length}>${p3}</h${p2.length}>` ],
    "newline": [
        "(?:\r\n|\r|\n)",
        "<br>" ],
    "quoteMerge": [
        "</blockquote><br><br><blockquote>",
        "<br>" ],
};

/**
 * 
 */
function initialize () {

    // save init text
    var bodyDom = $("body");
    var initText = bodyDom.text();

    // truncate body
    bodyDom.text("");

    // create header
    createHead();

    bodyDom.append( "<div id='header'></div>" );
    $("#header").load(getUrlRoot() + '__engine/header.html');


    // create body
    var processed = replaceByRule(initText);

    bodyDom.append(
        "<div id='content'>" +
        "<h1 id='title'>" + getPageTitle() + "</h1>" + 
        processed + 
        "</div>");

    // create footer
    bodyDom.append( "<div id='footer'></div>" );
    $('#footer').load(getUrlRoot() + '__engine/footer.html');
}

/**
 * 
 * @param {*} text 
 */
function replaceByRule(text) {

    var replacedText = text;

    $.each(regex, (key, value) => {
        replacedText = replacedText.replace(new RegExp(value[0], "g"), value[1])
    });

    return replacedText;
}

/**
 * 
 */
function createHead() {

    var title = getPageTitle() + " | Sparatiro";

    var htmlString =
        "<meta charset=\"UTF-8\">\n" +
        "<title>"+title+"</title>\n" +
        "<link rel='stylesheet' type='text/css' href='./__engine/design/default.css'>";

    $("head").append(htmlString);
}

/**
 * 
 */
function getUrlRoot()
{
    var getUrl = window.location;
    var baseUrl = 
        getUrl.protocol + "//" + 
        getUrl.host     + "/" + 
        getUrl.pathname.split('/')[1] + "/";

    return baseUrl.toString();
}

/**
 * 
 */
function getPageTitle() {
    
    var properTitle = 
        window.location.toString()
            .replace(getUrlRoot(), "")
            .replace("_", " ")
            .replace("~", " / ")
            .replace(".html", "");
    
    // uppercase
    return properTitle[0].toUpperCase() + properTitle.slice(1);
}

// start
$(document).ready(function(){
    initialize();
});