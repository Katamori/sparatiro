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

/*
 * This one guarantees nobody can see unformatted markdown
 * TODO: is there a better way?
 */
document.onreadystatechange = () => {
    if (document.readyState === 'interactive')
    {
        document.querySelector("body").style = "visibility: hidden;";
    }
}

window.onload = () => {
    declareComputedGlobals() //TODO: find a better way
    preload()
    includeJs(JQUERY_URL)
    // load jQuery; then load configfile with it
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
}

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
    return new Promise((onload, onerror) => {
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
    });
}

/**
 * 
 * @param {*} url 
 */
function includeJSON(url) 
{
    return new Promise((ondone, reject) => {
        // I admit it looks stupid for now but I may want to extend it later
        $(document).ready($.getJSON(url, ondone));
    });
}

/**
 * 
 * @param {*} jsonVal 
 */
function loadConfig(jsonVal)
{
    return new Promise((resolve, reject) => {
        conf = jsonVal;

        resolve();
    });
}

/**
 * preload
 */
function preload()
{
    bodyDom.innerHTML = '<div style="visibility:visible;">Loading...</div>';
}

/**
 * initialize
 */
function initialize()
{
    if (!Article.find(getPageTitle())) {
        window.location = "/404.html";
    }

    createHead();             // create HTML head
    createBody();             // create HTML body

    bodyDom.removeAttribute("style");
}

/**
 * declareComputedGlobals
 */
function declareComputedGlobals()
{
    bodyDom = document.getElementsByTagName('body')[0];
    initText = bodyDom.innerHTML;
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
    bodyDom.innerHTML = "";

    Article.createHeader();
    Article.createContent();
    Article.createFooter();
}

class Article {
    /**
     * find
     */
    static find(pageTitle)
    {
        let separated = pageTitle.toLowerCase().split(" / ");
    
        // if I could separate it, then it has a namespace
        if (separated.length > 1) {
            let titleNamespace = separated[0];
            let title = separated[1];
    
            return (index.namespace.hasOwnProperty(titleNamespace) && index.namespace[titleNamespace].includes(title))
    
        // otherwise search in regular or reserved
        } else {
            let title = separated[0];
    
            return (pageTitle === "" || index.regular.includes(title) || index.reserved.includes(Url.getFileName(true)))
        }
    }

    /**
     * createHeader
     */
    static createHeader()
    {    
        bodyDom.insertAdjacentHTML(
        "beforeend",  
        "<div id='header'></div>");
        
        $("#header").load(Url.getRoot() + 'engine/header.html');
    }

    /**
     * createContent
     */
    static createContent()
    {
        // handle system defaults
        switch (Url.getFileName()) {
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


        bodyDom.insertAdjacentHTML(
            "beforeend",
            "<div id='content'>" +
            "<h1 id='title'>" + getPageTitle() + "</h1>" +
            formattedContent +
            "</div>");
    }

    /**
     * createFooter
     */
    static createFooter()
    {
        bodyDom.insertAdjacentHTML('beforeend', "<div id='footer'></div>");
        $('#footer').load(Url.getRoot() + 'engine/footer.html');
    }
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
		result += "## " + Util.toUpperCaseFirst(key) + "\n";

		// for each level 1 element
		Object.values(index[key]).forEach(element => {
			switch (key) {
				// for "regular", produce a simple list
				case "regular":
					result += "* [" + getPageTitle(element) + "](" + stringToLink(element + ".html") + ")\n"
					break;
				// for "reserved", refer to a name map
				case "reserved":
					result += "* [" + reservedMap[element + ".html"] + "]("+ stringToLink(element + ".html") + ")\n"

					break;
				default:
					break;
			}
		});

		// handle namespace separately: list level 2 elements too
		if (key === "namespace") {
			let namespaces = index[key];

			for (var subkey in namespaces) {
				if (namespaces.hasOwnProperty(subkey)) {
					// namespace title
					result += "### " + getPageTitle(subkey) + "\n";

					// namespace elements
					Object.values(namespaces[subkey]).forEach(subelement => {
						result += "* [" + Util.toUpperCaseFirst(subelement) + "](" + stringToLink(subkey + "~" + subelement + ".html") + ") \n"
					})
				}
			}
		}
	});

	return result;
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
		fileName = Url.getFileName();
	}

	if (fileName === "") {
		return "Index";
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
	return Util.toUpperCaseFirst(properTitle);
}

class Url {
    /**
     * getFileName
     */
    static getFileName(noExtension = "false")
    {
        let fileName = window.location.pathname.split("/").pop();
        
        if (noExtension) {
            return fileName.replace(/.html/g, "");
        }

        return fileName;
    }

    /**
     * getRoot
     */
    static getRoot()
    {
        let url = window.location.href.split("/");

        url.pop();

        return url.join("/") + "/";
    }
}

class Util {
    /**
     * stringToLink
     * 
     * @param {*} string 
     */
    static stringToLink(string)
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
    static toUpperCaseFirst(string)
    {
        if (string === "" || string === " ") {
            return string;
        }

        return string[0].toUpperCase() + string.slice(1);
    }
}