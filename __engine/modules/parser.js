/**
 * Contains all the regex-based functionality intended to be used in Sparatiro.
 */

// may help: https://gist.github.com/jbroadway/2836900
const acceptedBodyCharacters = "a-zA-Z0-9 ,.;\<\>='\"!-.\/";
const acceptedUrlCharacters = "a-zA-Z0-9,.;\<\>='\"!-.\/";
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
    "outerlink": [
        //todo 
        "\\[([" + acceptedBodyCharacters + "]*)\\]\\(([:" + acceptedUrlCharacters + "]*)\\)", 
        "<a href='$2'>$1</a>" ],
    "interlink": [ 
        //todo; just simple interlink
        "\\[([" + acceptedBodyCharacters + "]*)\\]", 
        (p1, p2) => '<a href=\''+p2.replace(new RegExp(' ', 'g'), '_')+'\'>'+p2+'</a>' ],
    "list": [
        //todo: it's quite shitty so far
        "(\\*|-|\\+) ([" + acceptedBodyCharacters + "]*)", 
        "<li>$2</li>" ],
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
 * @param {*} text 
 */
function replaceByRule(text) {

    var replacedText = text;

    $.each(regex, (key, value) => {
        replacedText = replacedText.replace(new RegExp(value[0], "g"), value[1])
    });

    return replacedText;
}