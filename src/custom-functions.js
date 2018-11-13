export default function( XPathJS ) {

    const FUNCTIONS = {
        'comment-status': {

            fn( a ) {
                const curValue = a.toString();
                let status = '';
                let comment;

                if ( curValue ) {
                    try {
                        comment = JSON.parse( curValue );
                        comment.queries = ( Array.isArray( comment.queries ) ) ? comment.queries : [];
                        comment.logs = ( Array.isArray( comment.logs ) ) ? comment.logs : [];
                        if ( typeof comment === 'object' && comment !== null ) {
                            // duplicates _getCurrentStatus() in Dn.js
                            comment.queries.concat( comment.logs ).some( item => {
                                if ( typeof item === 'object' && item !== null && item.status ) {
                                    status = item.status;
                                    return true;
                                }
                                return false;
                            } );
                        }
                    } catch ( e ) {
                        console.error( 'Could not parse JSON from', curValue );
                    }
                }

                return new XPathJS.customXPathFunction.type.StringType( status );
            },

            args: [
                { t: 'string' }
            ],

            ret: 'string'

        }
    };

    Object.keys( FUNCTIONS ).forEach( fnName => {
        XPathJS.customXPathFunction.add( fnName, FUNCTIONS[ fnName ] );
    } );

};
