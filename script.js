// ==UserScript==
// @name         PlatziHack IV - emojis (beta)
// @namespace    http://tampermonkey.net/
// @version      0.1b
// @description  emojis en el Live!
// @author       @jjyepez
// @match        http*://platzi.com/live/*
// @match        http*://platzi.com/clases/*
// @grant        none
// ==/UserScript==


// Es una versión beta .. lo que significa que muchas cosas se pueden mejorar :) .. so be gentle! --- jjy
var cachedJson;
var emojis;

(function() {
    'use strict';

    // document.querySelector('.stream').remove(); // --- opcional para evitar la regarca del video con cada F5 -- jjy

    // para agregar clases css al dom
    const estilo = document.createElement('style');
          estilo.textContent = `
            pre    { font-size: 1rem }
            .oculto{ display: none !important }
          `;
    document.head.appendChild( estilo )

    const $chatForm = document.querySelector('.ChatForm');

    // para agregar estilos a un elemento del dom
    const $bE = document.createElement('div');
          $bE.setAttribute( 'id','bEmoji' );
    Object.assign( $bE.style, {
        position:  'absolute',
        width:     '24px',
        height:    '24px',
        right:     '.25rem',
        top:       '.25rem',
        textAlign: 'center'
    });

    const $bEico = document.createElement('div');
    Object.assign ($bEico.style, {
        fontSize: '1.3rem',
        cursor:   'pointer',
        opacity:  '.75'
    });
    $bEico.innerHTML = '😃';

    $bE.appendChild( $bEico );
    $chatForm.appendChild( $bE );

    $bEico.addEventListener('click', e => {
        const $bE = document.querySelector('#bEmoji');
        var $pO = document.querySelector('.jjPopOver' );
        if( !$pO ){
            $pO = document.createElement('div');
            $pO.classList.add('jjPopOver');
            Object.assign( $pO.style, {
                position: 'absolute',
                width:    '15rem',
                height:   '11.7rem',
                top:      '2rem',
                right:    '.25rem',
                zIndex:   '100',
                backgroundColor:'white',
                borderRadius:   '10px 0 10px 10px',
                boxShadow:      '0 5px 20px rgba(0,0,0,.25)',
                overflow:       'hidden',
                display:        'flex',
                flexDirection:  'column'
            })
            $bE.appendChild( $pO );

            cachedJson = window.localStorage.getItem('platziHackIV:jsonEmojis'); // cache manual
            if( !cachedJson ){
                // este bloque se apoya en la definición del arreglo para los emojis (pen externo)
                fetch('https://noesishosting.com/sw/cors/?a=cors&url=https://codepen.io/jjyepez/pen/dewLLw.js')
                .then( rsp => rsp.json() )
                .then( data => {
                    inicializar(data);
                    window.localStorage.setItem( 'platziHackIV:jsonEmojis', JSON.stringify( data ) ); // cache manual
                })
                .catch( e => {
                    console.log(e);
                })
            } else {
                inicializar( JSON.parse( cachedJson ) ); // emojis en cache
            }
        } else {
            $pO.classList.toggle('oculto');
        }
    })

    function mostrarCategoria( nCat ){ // se puede mejorar
        const $catActual = document.querySelector('.cat-' + nCat);
        const $catAnt = document.querySelector('.cat.actual');
        if( $catAnt ){
            Object.assign( $catAnt.style, {
                backgroundColor: '#f0f0f0'
            })
            $catAnt.classList.remove('actual');
        }
        Object.assign( $catActual.style, {
            backgroundColor: '#fff'
        })
        $catActual.classList.add('actual');
        $catActual.scrollTop;

        const $contCat = document.querySelector('.contCat');
              $contCat.innerHTML = '';
        emojis.data[nCat].emojis.forEach( (el,i) => {
            const $ico = document.createElement('div');
            $ico.classList.add('ico');
            Object.assign( $ico.style, {
                textAlign:'center',
                width:    'auto',
                maxWidth: '30px',
                overflow: 'hidden',
                height:   '1.35rem',
                cursor:   'pointer'
            })
            $ico.innerHTML = el;
            if( $ico.innerText.length < 5 ){ // debe haber una mejor manera de descartar los emojis que no estan soportados por el navegador
                $contCat.appendChild( $ico );
                $ico.addEventListener('click', e => {
                    
                    const $input = document.getElementById('chat-input');
                    $input.style.padding = '10px 2rem 25px 10px';
                    $input.value += e.target.innerHTML;
                    // document.querySelector('.jjPopOver').classList.add('oculto'); --- opcional
                    $input.focus();
                });
                // aun estan pendientes por descartar los que muestran un rectangulo en lugar del emoji
            }
        })
    }

    function inicializar( data ) {
        emojis = data;
        const $pO = document.querySelector('.jjPopOver');

        const $cont = document.createElement('div');
        const $contCat = document.createElement('div');
        $contCat.classList.add('contCat');

        Object.assign($cont.style, {
            display:  'flex',
            textAlign:'center',
            width:    '100%',
            height:   '2rem',
        })
        Object.assign($contCat.style, {
            display:            'grid',
            gridTemplateColumns:'auto auto auto auto auto auto auto',
            textAlign:          'center',
            height:             '100%',
            backgroundColor:    'white',
            overflow:           'auto',
            padding:            '.5rem .25rem'
        })
        emojis.data.forEach( (el,i) => {
            const $cat = document.createElement( 'div' );
            $cat.classList.add('cat');
            $cat.classList.add('cat-'+i);
            $cat.setAttribute('data-cat', i);
            Object.assign($cat.style, {
                fontSize: '1.15rem',
                flex: '1',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
            })
            $cat.classList.add('cat');
            $cat.classList.add('cat-'+i);
            $cat.innerHTML = el.categoria;

            $cont.appendChild( $cat );

            $cat.addEventListener( 'click', e => {
                mostrarCategoria( e.target.getAttribute('data-cat') );
            })
        })
        $pO.appendChild( $cont );
        $pO.appendChild( $contCat );
        $pO.classList.remove('oculto');

        document.querySelectorAll('.cat')[0].click();
    }

})();
