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

These are loaded on every article you visit.

## Simple pages

Create an HTML file, but instead of the regular tags, include only `__engine/sparatiro.js`.

## Namespaces

Namespaces are defined in the title (that is, the filename) separated by `~`.

## Development

### Modules

As of 2018-10-11, Sparatiro Modules are JS files containing functions used quite anywhere.

# TO-DO

* Syntax handling
    * Multimedia
    * Fine-tune

* A huge refactor on naming

* Try to make an universal header without extra framework
    * though I'd be fine with Vue