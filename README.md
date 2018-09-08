# sparatiro
An extremely small wiki engine built on minimalism.

The basic idea is to have HTML files as the wiki pages containing nothing more than the sparatiro.js, jquery, and a custom text

Under heavy development.

# How to use

__engine contains every underlying mechanics. Don't modify it if possible.

## Simple pages

Create an HTML file, but instead of the regular tags, include only jQuery preferably 3.3.1) and `__engine/sparatiro.js`.

## Namespaces

Namespaces are defined in the title (that is, the filename) separated by `~`.


# TO-DO

* Syntax handling
    * Multimedia
    * Fine-tune

* A huge refactor on naming

* Try to make an universal header without extra framework
    * though I'd be fine with Vue