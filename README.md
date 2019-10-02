# sparatiro
An extremely small wiki engine built on minimalism.

The basic idea is to have HTML files as the wiki pages containing nothing more than the sparatiro.jsand a custom text

Under heavy development.

# How to use

engine contains every underlying mechanics. Don't modify it if possible.

## Dependencies

The engine contains the following third-party scripts:

* [jQuery 3.3.1](https://jquery.com/) - compressed; not self-hosted anymore

* [MarkdownJS by Dominic "evilstreak" Baggott](https://github.com/evilstreak/markdown-js) - browser build

These are loaded on every article you visit.

## Simple pages

Create an HTML file, but instead of the regular tags, include only `engine/sparatiro.js` with a `script` tag.

### Difference from regular Markdown syntax

Inner links are a thing: 
`this [might be] it` => `this [might be](might_be) it`

Inner links are also automatically given an extension:
`just [a hero](a-hero) there` => `just [a hero](a-hero.html) there`

This is important because articles can't be found without their extension.

## Namespaces

Namespaces are defined in the title (that is, the filename) separated by `~`.

## Article index	

Since Sparatiro is backend-agnostic, the only way of implementing features involving search (e.g. wanted pages, content, what links here) is by maintaining a manual article index by yourself.	

The article index file is `settings/index.json` and you can use it by simply listing them as in the example.	

For security and usability reasons, "unindexed" pages (HTML files with name not appearing in the index) won't be rendered by Sparatiro.

**Important!** By its inherent nature, Sparatiro supports only top-level articles (`<your-access>/<article-name>`) and the only means of going deeper is namespaces. Every tool is built around the idea of it.

### Reserved names

There are system-default filenames and titles; these are defined in `settings\index.json` and added to the global variable `reservedMap`. You're not allowed to create any articles using these names.

## Development

### Modules

As of 2018-10-11, Sparatiro Modules are JS files containing functions used quite anywhere.

# TO-DO

* article index implementation
    * interrupt init on unindexed articles
        * utilize Promise rejects for that
    * colorize 404 URLs
    * implement reserved names
        * index display
        * random
        * wanted pages
    * better 404

* A huge refactor on naming

* Try to make an universal header without extra framework

* Merging design from "beta" branch as an optional display method

* Abandon jQuery altogether
    * is that even possible?

* hide unparsed content when JS codes aren't loaded yet

* check out if it's worthy: https://github.com/linyouhappy/fast-markdown-js

* compatibility with backend so static rendered snapshots can be made