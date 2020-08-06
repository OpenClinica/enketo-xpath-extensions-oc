const parser = new DOMParser();
import XPathJS from 'enketo-xpathjs';
import OpenRosaXPath from 'openrosa-xpath-evaluator';
const NAMESPACES = {
    'xhtml': 'http://www.w3.org/1999/xhtml',
};

// Add custom functions
import extendXPath from '../src/custom-functions';
extendXPath( XPathJS );
extendXPath ( OpenRosaXPath );

export default {
    xhtmlResolver: {
        lookupNamespaceURI: prefix => NAMESPACES[ prefix ] ? NAMESPACES[ prefix ] : null
    },
    getDocWithXPathJs: xmlStr => {
        const doc = parser.parseFromString( xmlStr, 'text/xml' );

        XPathJS.bindDomLevel3XPath( doc );

        return doc;
    },
    getDocWithOpenRosaXpath: xmlStr => {
        const doc = parser.parseFromString( xmlStr, 'text/xml' );

        OpenRosaXPath.bindDomLevel3XPath( doc );

        return doc;
    }
};
