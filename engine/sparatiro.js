const acceptedBodyCharacters = "a-zA-Z0-9 ,.;\<\>='\"!";
const regex = {
    "lorem": [ 
        "lorem-ipsum", 
        "aaaaaaaaaaaaaaaaa" ],
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
    createHead("indeksz pont hateemel");

    bodyDom.append( "<div id='header'></div>" );
    $("#header").load('./engine/header.html');


    // create body
    var processed = replaceByRule(initText);

    bodyDom.append(processed);

    // create footer
    bodyDom.append( "<div id='footer'></div>" );
    $('#footer').load('./engine/footer.html');
}

/**
 * 
 * @param {*} text 
 */
function replaceByRule(text) {

    var replacedText = text;

    $.each(regex, (key, value) => {
        console.log(new RegExp(value[0], "g"));
        replacedText = replacedText.replace(new RegExp(value[0], "g"), value[1])
    });
    console.log(replacedText);
    return replacedText;
}

/**
 * 
 * @param {*} title 
 */
function createHead(title) {
    var htmlString =
        "<meta charset=\"UTF-8\">\n" +
        "<title>"+title+"</title>\n" +
        "<link rel='stylesheet' type='text/css' href='theme.css'>";

    $("head").append(htmlString);

    $(htmlString).appendTo(/* I have no idea, don't even try yet */);
}

// start
$(document).ready(function(){
    initialize();
});