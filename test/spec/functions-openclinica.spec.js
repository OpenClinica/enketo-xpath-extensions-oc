import helpers from '../helpers';

describe( 'Custom "OpenClinica" functions', () => {

    const doc = helpers.getDoc( '<data><a id="oc1"/></data>' );

    describe( 'valid comment-status() calls', () => {
        const a = {
            'queries': [],
            'logs': [ {
                'type': 'comment',
                'assigned_to': 'Ada Clare (aclare)',
                'date_time': '2016-04-22 14:44:20 -06:00',
                'comment': 'This is an older comment.',
                'status': 'updated',
                'user': 'Maurice Moss (moss)'
            }, {
                'type': 'audit',
                'message': 'Item data value updated from old_value to new_value.',
                'date_time': '2016-05-18 12:44:20 -06:00',
                'user': 'Jen Barber (jen)',
            } ]
        };
        const b = {
            'queries': [ {
                'type': 'comment',
                'assigned_to': 'Ada Clare (aclare)',
                'date_time': '2016-04-22 14:44:20 -06:00',
                'comment': 'This is an older comment.',
                'status': 'updated',
                'user': 'Maurice Moss (moss)'
            }, {
                'type': 'audit',
                'message': 'Item data value updated from old_value to new_value.',
                'date_time': '2016-05-18 12:44:20 -06:00',
                'user': 'Jen Barber (jen)',
            } ],
            'logs': []
        };

        it( 'returns empty for empty node', () => {
            var el = doc.getElementById( 'oc1' );
            el.textContent = '';
            const result = doc.evaluate( 'comment-status(.)', el, null, 2, null );
            expect( result.stringValue ).to.equal( '' );
        } );

        [
            [ 'comment-status(.)', '', '' ],
            [ 'comment-status(.)', 'a', '' ],
            [ 'comment-status(.)', {}, '' ],
            [ 'comment-status(.)', { queries: [] }, '' ],
            [ 'comment-status(.)', { logs: [] }, '' ],
            [ 'comment-status(.)', a, 'updated' ],
            [ 'comment-status(.)', b, 'updated' ],
            [ 'comment-status(//*[@id="oc1"])', b, 'updated' ]
        ].forEach( t => {
            it( 'correctly parses status', () => {
                let result;
                const el = doc.getElementById( 'oc1' );
                const jsonStr = JSON.stringify( t[ 1 ] );

                // Obtain string value from XML node
                el.textContent = jsonStr;
                result = doc.evaluate( t[ 0 ], el, null, 2, null );
                expect( result.stringValue ).to.equal( t[ 2 ] );

                // Obtain string value directly from argument.
                // note: the below only works with single quotes around jsonStr
                result = doc.evaluate( `comment-status('${jsonStr}')`, doc, null, 2, null );
                expect( result.stringValue ).to.equal( t[ 2 ] );
            } );
        } );
    } );

    describe( 'invalid comment-status() calls', () => {

        it( 'with too many arguments', () => {
            const test = () => doc.evaluate( 'comment-status(., "2nd argument")', doc.getElementById( 'oc1' ), helpers.xhtmlResolver, 2, null );
            expect( test ).to.throw( /expects \(string\)/ );
        } );

        it( 'with too many arguments', () => {
            const test = () => doc.evaluate( 'comment-status()', doc.getElementById( 'oc1' ), helpers.xhtmlResolver, 2, null );
            expect( test ).to.throw( /expects \(string\)/ );
        } );

    } );
} );
