/**
 * CONFIGURATION
 */
const conf = {
    // dependencies
    "deps": {
        "jquery":   './__engine/third-party/jquery-3.3.1/jquery-3.3.1.min.js',
        "markdown": './__engine/third-party/markdown-browser-0.6.0-beta1/markdown.min.js',
    },
    "html": {
        "metadata": {
            //"charset": "UTF-8",
            "name": {
                "author":  "Zoltán 'Katamori' Schmidt",
            },
        }
    },
    "modulesRoot":  '__engine/modules',
    "modules": {

    }
};

/**
 * Loads jQuery and configured dependencies.
 * 
 * @param {*} filename 
 * @param {*} onload 
 */
function includeJs(filename, onload)
{
    //source: https://stackoverflow.com/a/8139909/2320153
    let script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function() {
        if (script.readyState 
            && (script.readyState === 'complete' 
                || script.readyState === 'loaded'
            )
        ) {
            script.onreadystatechange = null;                                                  
        }       
        onload();
    };
    document.getElementsByTagName('head')[0].appendChild(script);
}


includeJs(conf.deps.jquery, () => {
    $(document).ready(includeJs(conf.deps.markdown, initialize));  
});

/**
 * 
 */
function initialize()
{
    declareComputedGlobals(); // TODO: find a better way
    createHead();             // create HTML head
    createBody();             // create HTML body
}

/**
 * declareComputedGlobals
 */
function declareComputedGlobals()
{
    bodyDom = $("body");
    initText = bodyDom.text();
}

/**
 * createHead
 */
function createHead()
{
    let metatags = "";

    // generate meta tags; source: https://stackoverflow.com/a/7242062/2320153
    // It is worth noting, that "There is no way to stop or break a forEach() loop other than by throwing an exception
    let meta = conf.html.metadata.name;

    Object.keys(meta).forEach((key) => {
        metatags += "<meta name=\"" + key + "\" content=\"" + meta[key] + "\">\n";
    });

    let title       = getPageTitle() + " | Sparatiro";

    let titleTags   = "<title>"  +title + "</title>\n";
    let cssLink     = "<link rel='stylesheet' type='text/css' href='./__engine/design/default.css'>";

    let htmlString =
        metatags
        + titleTags
        + cssLink;

    $("head").append(htmlString);
}

/**
 * createBody
 */
function createBody()
{
    bodyDom.text("");

    createArticleHeader();
    createArticleContent();
    createArticleFooter();
}

/**
 * createArticleHeader
 */
function createArticleHeader()
{
    bodyDom.append( "<div id='header'></div>" );
    $("#header").load(getUrlRoot() + '__engine/header.html');
}

/**
 * createArticleContent
 */
function createArticleContent()
{
    let formattedContent = markdown.toHTML(initText);

    bodyDom.append(
        "<div id='content'>" +
        "<h1 id='title'>" + getPageTitle() + "</h1>" +
        formattedContent +
        "</div>");
}

/**
 * createArticleFooter
 */
function createArticleFooter()
{
    bodyDom.append( "<div id='footer'></div>" );
    $('#footer').load(getUrlRoot() + '__engine/footer.html');
}

/**
 * getPageTitle
 */
function getPageTitle()
{
    let properTitle =
        window.location.toString()
            .replace(getUrlRoot(), "")
            .replace("_", " ")
            .replace("~", " / ")
            .replace(".html", "");

    // uppercase
    return properTitle[0].toUpperCase() + properTitle.slice(1);
}

/**
 * getUrlRoot
 */
function getUrlRoot()
{
    let getUrl = window.location;
    let baseUrl =
        getUrl.protocol + "//" +
        getUrl.host     + "/";

    return baseUrl.toString();
}

