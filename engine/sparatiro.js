const regex = {
    "lorem"         : "lorem-ipsum",
    "bold"          : "/* todo */",
    "italic"        : "/* todo */",
    "underscore"    : "/* todo */",
    "interlink"     : "/* todo */",
    "outerlink"     : "/* todo */",
    "header"        : "/* todo */"
};

function initialize () {

    // save init text
    var bodyDom = $("body");
    var initText = bodyDom.text();

    // truncate body
    bodyDom.text("");

    // create header
    $( "<div id='header'></div>" ).appendTo( "body" );
    $("#header").load('/engine/header.html');


    // create body
    var processed = replaceByRule(initText, regex["lorem"]);

    $("<div></div>").text(processed).appendTo("body");

    // create footer
    $( "<div id='footer'></div>" ).appendTo( "body" );
    $('#footer').load('/engine/footer.html');
}

function replaceByRule(text, regex) {

    var replacedText = text;

    if (regex === regex["lorem"]) {
        replacedText = text+"lorem_ipsum"+text+"lorem_ipsum"+text+"lorem_ipsum"+text+"lorem_ipsum";
    }

    return replacedText;
}

function createHead(title) {
    var htmlString =
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <title>"+title+"</title>\n" +
        "</head>";

    $(htmlString).appendTo(/* I have no idea, don't even try yet */);
}

// start
$(document).ready(function(){
    initialize();
});