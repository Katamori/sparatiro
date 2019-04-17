/**
 * CONFIGURATION
 */
const conf = {
    // dependencies
    "deps": {
        "jquery":   './__engine/third-party/jquery-3.3.1/jquery-3.3.1.min.js',
        "markdown": './__engine/third-party/markdown-browser-0.6.0-beta1/markdown.min.js',
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
    declareGlobalVariables();   // TODO: find a better way
    createHead();               // create HTML head
    createBody();               // create HTML body
}

/**
 * declareGlobalVariables
 */
function declareGlobalVariables()
{
    bodyDom = $("body");
    initText = bodyDom.text();
}

/**
 * createHead
 */
function createHead()
{
    let title = getPageTitle() + " | Sparatiro";

    let htmlString =
        "<meta charset=\"UTF-8\">\n" +
        "<title>"  +title + "</title>\n" +
        "<link rel='stylesheet' type='text/css' href='./__engine/design/default.css'>";

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

