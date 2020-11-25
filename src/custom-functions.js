export default function( Evaluator ) {

    // To cater to slight differences between old XPathJS and new ORXE evaluators
    const NEW_ORXE = !Evaluator.customXPathFunction.type;

    const FUNCTIONS = {
        'comment-status': {

            fn( a ) {
                const curValue = NEW_ORXE ? a : a.toString();

                let status = '';
                let comment;

                if ( curValue ) {
                    try {
                        comment = JSON.parse( curValue );
                        if ( typeof comment !== 'object' || Array.isArray( comment ) ) {
                            throw new Error( 'Not an object.' );
                        }
                        comment.queries = Array.isArray( comment.queries ) ? comment.queries : [];

                        // duplicates _getCurrentStatus() in Dn.js
                        const commentsOrdered = comment.queries
                            .filter( item => item.type === 'comment' )
                            .sort( _datetimeDesc );
                        const threads = _getThreads( commentsOrdered );

                        [ 'new', 'updated', 'closed', 'closed-modified' ].some( st => {
                            if ( _existsThreadWithStatus( commentsOrdered, threads, st ) ) {
                                status = st;
                                return true;
                            }
                            return false;
                        } );

                    } catch ( e ) {
                        console.error( 'Could not parse JSON from', curValue );
                    }
                }

                return NEW_ORXE ? status : new Evaluator.customXPathFunction.type.StringType( status );
            },

            args: [
                { t: 'string' }
            ],

            ret: 'string'

        },

        'pad2': {

            fn( a ) {
                let val = NEW_ORXE ? a : a.toString();

                while ( val.length < 2 ) {
                    val = '0' + val;
                }

                return NEW_ORXE ? val : new Evaluator.customXPathFunction.type.StringType( val );
            },

            args: [
                { t: 'string' }
            ],

            ret: 'string'

        }
    };

    Object.keys( FUNCTIONS ).forEach( fnName => {
        Evaluator.customXPathFunction.add( fnName, FUNCTIONS[ fnName ] );
    } );

}

function _getThreads( commentsOrdered ) {
    let threads = [];

    // reverse is destructive, so we create copy
    [ ...commentsOrdered ].reverse()
        .forEach( item => {
            if ( !threads.includes( item.thread_id ) ) {
                threads.push( item.thread_id );
            }
        } );
    return threads;
}

function _datetimeDesc( a, b ) {
    const aDate = new Date( _getIsoDatetimeStr( a.date_time ) );
    const bDate = new Date( _getIsoDatetimeStr( b.date_time ) );
    if ( bDate.toString() === 'Invalid Date' || aDate > bDate ) {
        return -1;
    }
    if ( aDate.toString() === 'Invalid Date' || aDate < bDate ) {
        return 1;
    }
    return 0;
}

function _getIsoDatetimeStr( dateTimeStr ) {
    let parts;
    if ( typeof dateTimeStr === 'string' ) {
        parts = dateTimeStr.split( ' ' );
        return `${parts[ 0 ]}T${parts[ 1 ]}${parts[ 2 ]}`;
    }
    return dateTimeStr;
}

function _existsThreadWithStatus( commentsOrdered, threads, status ) {
    return threads.some( threadId => {
        return _getQueryThreadStatus( commentsOrdered, threadId ) === status;
    } );
}

function _getQueryThreadStatus( commentsOrdered, threadId ) {
    let status = '';
    commentsOrdered
        .some( item => {
            if ( item.thread_id === threadId && item.status ) {
                status = item.status;
                return true;
            }
            return false;
        } );
    return status;
}
