/**
 * Sadly, without this two files, initialization can't be started.
 */
const JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js';
const CONFIG_URL = './settings/config.json';

// global variable containers
var conf = {};
var index = {};

var reservedMap = {
	"404.html": 			"Not found",
	"wanted_pages.html":	"Wanted pages",
	"random_article.html":	"Random article",
	"toc.html":				"List of articles",
}

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

        return (index.regular.includes(title) || index.reserved.includes(getFileNameNoExt()))
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

    let title       = getPageTitle() + " | " + conf.wikiName;

    let titleTags   = "<title>"  +title + "</title>\n";
    let cssLink     = "<link rel='stylesheet' type='text/css' href='./engine/design/default.css'>";

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
    $("#header").load(getUrlRoot() + 'engine/header.html');
}

/**
 * createArticleContent
 */
function createArticleContent()
{
	// handle system defaults
	switch (getFileName()) {
		//case "404.html":
		//case "wanted_pages.html":
		//case "random_artice.html":
		case "toc.html":
			initText = createToC();

			break;
		default:
			break;
	}

    // pre-processing: Katamori-to-Markdown
    let formattedContent = initText
    .replace(
        // self-referencing to valid link (https://stackoverflow.com/a/56030180/2320153)
        /\[([^\[\]]*)\](?!\([^()]*\))/g,
        m => `[${m.replace("[", "").replace("]", "")}](${stringToLink(m.replace("[", "").replace("]", ""))})`
    ).replace(
        // when an URL is assumed to be "inner", .html is added automatically
        /\[([A-Za-z0-9 \.\:\-\_\~]+)\]\(([A-Za-z0-9 _-~]+)\)/g,
        "[$1]($2.html)"
    )
    
    // the real deal
    formattedContent = markdown.toHTML(formattedContent);

    bodyDom.append(
        "<div id='content'>" +
        "<h1 id='title'>" + getPageTitle() + "</h1>" +
        formattedContent +
        "</div>");
}

/**
 * createToC
 */
function createToC()
{
	let result = "";

	// for every article index element
	Object.keys(index).forEach(key => {
		// add a MD header
		result += "## " + toUpperCaseFirst(key) + "\n";

		// for each level 1 element
		Object.values(index[key]).forEach(element => {
			switch (key) {
				// for "regular", produce a simple list
				case "regular":
					result += "* [" + getPageTitle(element) + "](" + element + ".html) \n"
					break;
				// for "reserved", refer to a name map
				case "reserved":
					result += "* [" + reservedMap[element + ".html"] + "](" + element + ".html) \n"

					break;
				// for "namespace", list level 2 elements too
				case "namespace":
					// namespace title
					result += "### " + toUpperCaseFirst(key) + "\n";

					// namespace elements
					element.forEach(subelement => {
						result += "* [" + toUpperCaseFirst(subelement) + "](" + subelement + ".html) \n"
					})

					break;
				default:
					break;
			}
		});
	});

	return result;
}

/**
 * createArticleFooter
 */
function createArticleFooter()
{
    bodyDom.append( "<div id='footer'></div>" );
    $('#footer').load(getUrlRoot() + 'engine/footer.html');
}

/**
 * getPageTitle
 * 
 * @param {*} fileName 
 */
function getPageTitle(fileName = null)
{
	// get last part of the URL
	if (fileName == null) {
		fileName = getFileName();
	}

	// handle system defaults
	if (Object.keys(reservedMap).includes(fileName)) {
		return reservedMap[fileName];
	}

    let properTitle = fileName.toString()
            .replace(/_/g, " ")
            .replace(/~/g, " / ")
            .replace(/.html/g, "")
            .replace(/\b./g, m => m.toUpperCase()); // capitalize words

	// uppercase
	return toUpperCaseFirst(properTitle);
}

/**
 * getFileName
 */
function getFileName()
{
	return window.location.pathname.split("/").pop();
}

/**
 * getFileNameNoExt
 */
function getFileNameNoExt()
{
	return getFileName().replace(/.html/g, "");
}

/**
 * getUrlRoot
 */
function getUrlRoot()
{
    let url = window.location.href.split("/");
console.log(window.location.href);
    url.pop();

    return url.join("/") + "/";
}

/**
 * stringToLink
 * 
 * @param {*} string 
 */
function stringToLink(string)
{
    return string
        .replace(/ /g, "_")
        .replace(/ \/ /g, "~")
        .toLowerCase();
}

/**
 * toUpperCaseFirst
 * 
 * @param {*} string 
 */
function toUpperCaseFirst(string)
{
	return string[0].toUpperCase() + string.slice(1);
}