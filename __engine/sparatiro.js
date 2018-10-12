/**
 * CONFIGURATION
 */
const conf = {
    "jqueryCDN":    'https://code.jquery.com/jquery-3.3.1.min.js',
    "modulesRoot":  '__engine/modules',
    "modules": {
        'parser':   '/parser.js',
    }
};

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


includeJs(conf.jqueryCDN, () => {
    
    $(document).ready(includeJs('./' + conf.modulesRoot + conf.modules.parser, initialize));  
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