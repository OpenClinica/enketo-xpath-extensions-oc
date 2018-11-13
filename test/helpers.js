const parser = new DOMParser();
import XPathJS from 'enketo-xpathjs';
const NAMESPACES = {
    'xhtml': 'http://www.w3.org/1999/xhtml',
};

// Add custom functions
import extendXPath from '../src/custom-functions';
extendXPath( XPathJS );

export default {
    xhtmlResolver: {
        lookupNamespaceURI: prefix => NAMESPACES[ prefix ] ? NAMESPACES[ prefix ] : null
    },
    getDoc: xmlStr => {
        const doc = parser.parseFromString( xmlStr, 'text/xml' );

        XPathJS.bindDomLevel3XPath( doc );

        return doc;
    }
};
