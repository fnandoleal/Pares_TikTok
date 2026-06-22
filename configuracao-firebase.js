/*
========================================
CONFIGURAÇÃO DO FIREBASE
========================================
*/

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/*
========================================
DADOS DO SEU PROJETO FIREBASE
========================================
*/

const configuracaoFirebase =
{
    apiKey: "AIzaSyCne-5nJF1sM7RcNL_f_yaMk6ec2pWiY64",

    authDomain: "pares-tiktok.firebaseapp.com",

    projectId: "pares-tiktok",

    storageBucket: "pares-tiktok.firebasestorage.app",

    messagingSenderId: "56861064674",

    appId: "1:56861064674:web:430cd78481dee83c6e8dbb"
};

/*
========================================
INICIALIZA O FIREBASE
========================================
*/

const aplicativo =
    initializeApp(
        configuracaoFirebase
    );

/*
========================================
CRIA A CONEXÃO COM O FIRESTORE
========================================
*/

const bancoDados =
    getFirestore(
        aplicativo
    );

/*
========================================
EXPORTA O BANCO PARA OUTROS ARQUIVOS
========================================
*/

export
{
    bancoDados
};