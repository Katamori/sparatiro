/*

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

</body>
</html>

 */

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
    $("<div></div>").text(replaceByRule(initText, "lorem")).appendTo("body");

    // create footer
    $( "<div id='footer'></div>" ).appendTo( "body" );
    $('#footer').load('/engine/footer.html');
}

function replaceByRule(text, regex) {

    var replacedText = text;

    if (regex = "lorem") {
        replacedText = text+"lorem_ipsum"+text+"lorem_ipsum"+text+"lorem_ipsum"+text+"lorem_ipsum";
    }

    return replacedText;
}

// start
$(document).ready(function(){
    initialize();
});