/*
 * This is the default options file for nodelint
 *
 * Changes released into the Public Domain by tav <tav@espians.com>
 * Options support added by Corey Hart <corey@codenothing.com>
 *
 */

// set your options here

var options = {
    adsafe     : false, // if ADsafe should be enforced
    bitwise    : false, // if bitwise operators should not be allowed
    browser    : false, // if the standard browser globals should be predefined
    cap        : false, // if upper case HTML should be allowed
    css        : false, // if CSS workarounds should be tolerated
    debug      : false, // if debugger statements should be allowed
    devel      : false, // if logging should be allowed (console, alert, etc.)
    eqeqeq     : false, // if === should be required
    es5        : true,  // if ES5 syntax should be allowed
    evil       : false, // if eval should be allowed
    forin      : false, // if for in statements must filter
    fragment   : false, // if HTML fragments should be allowed
    immed      : false, // if immediate invocations must be wrapped in parens
    laxbreak   : false, // if line breaks should not be checked
    newcap     : true,  // if constructor names must be capitalized
    nomen      : false, // if names should be checked
    on         : false, // if HTML event handlers should be allowed
    onevar     : false,  // if only one var statement per function should be allowed
    passfail   : true,  // if the scan should stop on first error
    plusplus   : false,  // if increment/decrement should not be allowed
    regexp     : false, // if the . should not be allowed in regexp literals
    rhino      : false, // if the Rhino environment globals should be predefined
    undef      : false, // if variables should be declared before used
    safe       : false, // if use of some browser features should be restricted
    windows    : false, // if MS Windows-specigic globals should be predefined
    strict     : false, // require the "use strict"; pragma
    sub        : false, // if all forms of subscript notation are tolerated
    white      : false, // if strict whitespace rules apply
    widget     : false, // if the Yahoo Widgets globals should be predefined
    indent     : 4,     // set the expected indentation level

    // the following are defined by nodejs itself
    //predef     : [],

    // customise the error reporting -- the following colours the text red
    error_prefix: "\u001b[1m",
    error_suffix: ":\u001b[0m "
  };
