# sparatiro
An extremely small wiki engine built on minimalism.

The basic idea is to have HTML files as the wiki pages containing nothing more than the sparatiro.jsand a custom text

Under heavy development.

# How to use

__engine contains every underlying mechanics. Don't modify it if possible.

## Dependencies

The engine contains the following third-party scripts:

* [jQuery 3.3.1](https://jquery.com/) - compressed
* [MarkdownJS by Dominic "evilstreak" Baggott](https://github.com/evilstreak/markdown-js) - browser build

These are used on every article you visit.

## Simple pages

Create an HTML file, but instead of the regular tags, include only `__engine/sparatiro.js` with a `script` tag.

## Namespaces

Namespaces are defined in the title (that is, the filename) separated by the `~` delimiter.

## Article index

Since Sparatiro is backend-agnostic, the only way of implementing features involving search (e.g. wanted pages, content, what links here) is by maintaining a manual article index by yourself.

The article index file is `__settings/index.json` and you can use it by simply listing them as in the example.

For security and usability reasons, "unindexed" pages (HTML files with name not appearing in the index) won't be rendered by Sparatiro.

## Development

### Modules

As of 2018-10-11, Sparatiro Modules are JS files containing functions used quite anywhere.

# TO-DO

* article index implementation
    * load from JSON
    * interrupt init on unindexed articles
    * colorize 404 URLs
    * hardcode reserved names
    * implement reserved names
        * index display
        * random
        * wanted pages

* config.json implementation
    * load crucial data from it

* A huge refactor on naming

* Try to make an universal header without extra framework
    * though I'd be fine with Vue