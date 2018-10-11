# sparatiro
An extremely small wiki engine built on minimalism.

The basic idea is to have HTML files as the wiki pages containing nothing more than the sparatiro.js, jquery, and a custom text

Under heavy development.

# How to use

__engine contains every underlying mechanics. Don't modify it if possible.

## Simple pages

Create an HTML file, but instead of the regular tags, include only `__engine/sparatiro.js`. Be aware that Sparatiro downloads jQuery on the fly.

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