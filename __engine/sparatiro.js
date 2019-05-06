/**
 * Sadly, without this two files, initialization can't be started.
 */
const JQUERY_URL = './__engine/third-party/jquery-3.3.1.min.js';
const CONFIG_URL = './__settings/config.json';

// global variable containers
var conf = {};
var index = {};

/**
 * EXECUTION
 */
// load jQuery; then load configfile with it
includeJs(JQUERY_URL)                       
.then(() => includeJSON(CONFIG_URL))
.then((jsonData) => new Promise((resolve, reject) => {
    conf = jsonData;
    resolve();
}))

// load index
.then(() => includeJSON(conf.paths.index))
.then((jsonData) => new Promise((resolve, reject) => {
    index = jsonData;
    resolve();
}))

// load Markdown parser
.then(() => includeJs(conf.deps.markdown))  

// initialize "render"
.then(() => initialize());


/**
 * METHODS
 */

 /**
  * 
  * https://stackoverflow.com/a/8139909/2320153 [for the script tag creation]
  * https://stackoverflow.com/a/22519785/2320153 [for the Promise refactoring]
  * 
  * @param {*} filename 
  */
function includeJs(filename) 
{
    let handler = (onload, onerror) => {
        let script = document.createElement('script');

        let onLoadWrapper = () => {
            let state = script.readyState;

            if (state === 'complete' || 'loaded') {
                script.onreadystatechange = null;                                                  
            }
            
            onload();
        };

        script.src     = filename;
        script.type    = 'text/javascript';
        script.onload  = onLoadWrapper;
        script.onerror = onerror;

        document.getElementsByTagName('head')[0].appendChild(script);
    }

    return new Promise(handler);
}

/**
 * 
 * @param {*} url 
 */
function includeJSON(url) 
{
    let handler = (ondone, reject) => {
        // I admit it looks stupid for now but I may want to extend it later
        $(document).ready($.getJSON(url, ondone));
    }

    return new Promise(handler);
}

/**
 * 
 * @param {*} jsonVal 
 */
function loadConfig(jsonVal)
{
    let handler = (resolve, reject) => {
        conf = jsonVal;

        resolve();
    }

    return new Promise(handler);
}

/**
 * initialize
 */
function initialize()
{console.log(findArticle())
    if (!findArticle()) {
        //alert("Could not find this article in index!");
        window.location = "/404.html";
    }

    declareComputedGlobals(); // TODO: find a better way
    createHead();             // create HTML head
    createBody();             // create HTML body
}

function findArticle()
{
    let separated = getPageTitle().toLowerCase().split(" / ");

    // if I could separate it, then it has a namespace
    if (separated.length > 1) {
        let titleNamespace = separated[0];
        let title = separated[1];

        return (index.namespace.hasOwnProperty(titleNamespace) && index.namespace[titleNamespace].includes(title))

    // otherwise search in regular or reserved
    } else {
        let title = separated[0];

        return (index.regular.includes(title) || index.reserved.includes(title))
    }
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

