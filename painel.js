import {
    bancoDados
}
from "./configuracao-firebase.js";

import {
    collection,
    onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let participantes = [];

let ultimoNomeExibido = "";

let ultimaAprovacao = 0;

/*
========================================
NOME EM DESTAQUE
========================================
*/

function mostrarParticipanteDestaque() {

    if (
        participantes.length === 0
    ) {
        return;
    }

    let sorteado;

    do {

        sorteado =

            participantes[
                Math.floor(
                    Math.random() *
                    participantes.length
                )
            ];

    }
    while (

        participantes.length > 1 &&

        sorteado.tiktok ===
        ultimoNomeExibido

    );

    ultimoNomeExibido =
        sorteado.tiktok;

    const nome =

        document.getElementById(
            "nomeDestaque"
        );

    if (!nome) {
        return;
    }

    nome.style.opacity = "0";

    setTimeout(
        () => {

            nome.innerHTML =
                sorteado.tiktok;

            nome.style.opacity =
                "1";

        },
        500
    );

}

function iniciarRotacao() {

    mostrarParticipanteDestaque();

    const tempoAleatorio =

        Math.floor(
            Math.random() * 2001
        ) + 8000;

    setTimeout(
        iniciarRotacao,
        tempoAleatorio
    );

}