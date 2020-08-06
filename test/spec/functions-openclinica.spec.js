import helpers from '../helpers';

describe( 'Custom "OpenClinica" functions', () => {
    
    const xmlStr =  '<data><a id="oc1"/><b id="oc2"/></data>';
    const docs = { 
        'Old enketo-XPathJS evaluator': helpers.getDocWithXPathJs( xmlStr ),
        'New OpenRosa XPath evaluator': helpers.getDocWithOpenRosaXpath( xmlStr )
    };

    for ( const [evaluator, doc] of Object.entries(docs) ){

        describe(`using ${evaluator}`, () => {
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
                const c = {
                    'logs': [],
                    'queries': [
                        { 'type': 'comment', 'thread_id': 'a', 'status': 'updated', 'date_time': '2016-09-01 15:02 -06:00' },
                        { 'type': 'comment', 'thread_id': 'a', 'status': 'closed', 'date_time': '2016-09-01 15:01 -06:00' },
                        { 'type': 'comment', 'thread_id': 'b', 'status': 'closed-modified', 'date_time': '2016-07-01 15:01 -06:00' }
                    ]
                };
                const d = {
                    'logs': [],
                    'queries': [
                        { 'type': 'comment', 'thread_id': 'a', 'status': 'closed', 'date_time': '2016-09-01 15:02 -06:00' },
                        { 'type': 'comment', 'thread_id': 'a', 'status': 'updated', 'date_time': '2016-09-01 15:01 -06:00' },
                        { 'type': 'comment', 'thread_id': 'b', 'status': 'closed-modified', 'date_time': '2016-07-01 15:01 -06:00' }
                    ]
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
                    [ 'comment-status(.)', a, '' ],
                    [ 'comment-status(.)', b, 'updated' ],
                    [ 'comment-status(//*[@id="oc1"])', b, 'updated' ],
                    [ 'comment-status(.)', c, 'updated' ],
                    [ 'comment-status(.)', d, 'closed' ],
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
        
                it( 'with too few arguments', () => {
                    const test = () => doc.evaluate( 'comment-status()', doc.getElementById( 'oc1' ), helpers.xhtmlResolver, 2, null );
                    expect( test ).to.throw( /expects \(string\)/ );
                } );
        
            } );
        
        
            describe( 'valid pad2() calls', () => {
                const tests = [
                    [ '1', '01' ],
                    [ '', '00' ],
                    [ '01', '01' ],
                    [ '11', '11' ],
                    [ '001', '001' ],
                    [ 'abc', 'abc' ],
                    [ '-1', '-1' ],
                    [ 'a', '0a' ]
                ];
        
                // provide argument directly
                tests.forEach( t => {
                    const expr = `pad2("${t[0]}")`;
                    it( `correctly evaluates ${expr}`, () => {
                        const result = doc.evaluate( expr, doc, null, 2, null );
                        expect( result.stringValue ).to.equal( t[ 1 ] );
                    } );
                } );
        
                // argument is XML node
                tests.forEach( t => {
                    const expr = 'pad2(.)';
        
                    it( `correctly evaluates ${expr}`, () => {
                        const el = doc.getElementById( 'oc2' );
                        el.textContent = t[ 0 ];
                        const result = doc.evaluate( expr, el, null, 2, null );
                        expect( result.stringValue ).to.equal( t[ 1 ] );
                    } );
                } );
        
            } );
        
            describe( 'invalid pad2() calls', () => {
                it( 'with too many arguments', () => {
                    const test = () => doc.evaluate( 'pad2("2", "2nd argument")', doc, null, 2, null );
                    expect( test ).to.throw( /expects \(string\)/ );
                } );
        
                it( 'with too few arguments', () => {
                    const test = () => doc.evaluate( 'pad2()', doc, null, 2, null );
                    expect( test ).to.throw( /expects \(string\)/ );
                } );
        
            } );

        });

       

    }

    
} );
