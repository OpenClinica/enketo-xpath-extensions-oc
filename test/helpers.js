const parser = new DOMParser();
const XPathJS = require( 'enketo-xpathjs' );
const NAMESPACES = {
    'xhtml': 'http://www.w3.org/1999/xhtml',
};

// Add custom functions
require( '../src/custom-functions' )( XPathJS );

module.exports = {
    xhtmlResolver: {
        lookupNamespaceURI: prefix => NAMESPACES[ prefix ] ? NAMESPACES[ prefix ] : null
    },
    getDoc: xmlStr => {
        const doc = parser.parseFromString( xmlStr, 'text/xml' );

        XPathJS.bindDomLevel3XPath( doc );

        return doc;
    }
};
