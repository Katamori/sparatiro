/**
 * DEPENDENCIES
 */
const deps = {
    "jquery":   './__engine/third-party/jquery-3.3.1/jquery-3.3.1.min.js',
    "markdown": './__engine/third-party/markdown-browser-0.6.0-beta1/markdown.min.js',
};

const conf = {
    "modulesRoot":  '__engine/modules',
    "modules": {

    }
}

/**
 * Loads jQuery and configured dependencies.
 * 
 * @param {*} filename 
 * @param {*} onload 
 */
function includeJs(filename, onload) {
    //source: https://stackoverflow.com/a/8139909/2320153
    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function() {
        if (script.readyState 
            && (script.readyState === 'complete' 
                || script.readyState === 'loaded'
        )) {
            script.onreadystatechange = null;                                                  
        }       
        onload();
    };
    document.getElementsByTagName('head')[0].appendChild(script);
}


includeJs(deps.jquery, () => {
    $(document).ready(includeJs(deps.markdown, initialize));  
});

/**
 * 
 */
function initialize () {

    // save init text
    var bodyDom = $("body");
    var initText = bodyDom.text();

    // truncate body
    bodyDom.text("");
    bodyDom.append("<div id='wrapper'></div>");

    // create header
    createHead();

    // create body
    var processed = replaceByRule(initText);

    $('#wrapper').append(
        "<div id='main'><div class='inner'>" +
                "<header id='header'>" +
                    "<a href='#' class='logo'><strong>" + getPageTitle() + "</strong></a>"+
                    "<ul class='icons'>"+
                        "<li><a href='#' class='icon fa-twitter'><span class='label'>Twitter</span></a></li>" +
                        "<li><a href='#' class='icon fa-facebook'><span class='label'>Facebook</span></a></li>" +
                        "<li><a href='#' class='icon fa-snapchat-ghost'><span class='label'>Snapchat</span></a></li>" +
                        "<li><a href='#' class='icon fa-instagram'><span class='label'>Instagram</span></a></li>" +
                        "<li><a href='#' class='icon fa-medium'><span class='label'>Medium</span></a></li>" +
                    "</ul>" +
                "</header>" +
            processed +
            "</div>" +
        "</div>");

    // create sidebar
    $('#wrapper').append($("<div id='sidebar'>").load(getUrlRoot() + '__engine/sidebar.html'));

    // create footer
    //$('#wrapper').append( "<div id='footer'></div>" );
    //$('#footer').load(getUrlRoot() + '__engine/footer.html');
}

/**
 * 
 */
function createHead() {

    var title = getPageTitle() + " | Sparatiro";

    var htmlString =
        "<meta charset=\"UTF-8\">\n" +
        "<title>"+title+"</title>\n" +
        "<link rel='stylesheet' type='text/css' href='./__engine/design/default.css'>" +
        // design necessities; yet to be automated
        "<link rel='stylesheet' href='./__engine/design/editorial/assets/css/main.css' />";

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
        getUrl.host     + "/";

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

/**
 * 
 * @param {*} text 
 */
function replaceByRule(text) {

    var replacedText = text;

    return markdown.toHTML(text);
}