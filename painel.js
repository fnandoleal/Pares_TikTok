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

let quantidadeAnterior = 0;

let ultimoNomeExibido = "";

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

nome.style.opacity =
    "0";

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

function exibirNovoParticipante(
tiktok
) {

const area =
    document.getElementById(
        "novoCadastro"
    );

if (!area) {
    return;
}

area.style.display =
    "block";

area.innerHTML =

    `
    🎉 NOVO CADASTRO

    <br><br>

    ${tiktok}
    `;

const tempoAleatorio =

    Math.floor(
        Math.random() * 10001
    ) + 30000;

setTimeout(
    () => {

        area.style.display =
            "none";

    },
    tempoAleatorio
);

}

function animarTotal() {

const total =
    document.getElementById(
        "totalParticipantes"
    );

if (!total) {
    return;
}

total.style.transform =
    "scale(1.15)";

setTimeout(
    () => {

        total.style.transform =
            "scale(1)";

    },
    300
);

}

onSnapshot(

collection(
    bancoDados,
    "perfis"
),

(snapshot) => {

    const listaNova = [];

    snapshot.forEach(
        (doc) => {

            const perfil =
                doc.data();

            if (

                perfil.situacao ===
                "ativo"

                &&

                perfil.tiktok

            ) {

                listaNova.push(
                    perfil
                );

            }

        }
    );

    participantes =
        listaNova;

    const totalAtual =
        listaNova.length;

    const elementoTotal =
        document.getElementById(
            "totalParticipantes"
        );

    if (
        elementoTotal
    ) {

        elementoTotal.innerHTML =
            totalAtual;

    }

    if (

        quantidadeAnterior > 0 &&

        totalAtual >
        quantidadeAnterior

    ) {

        animarTotal();

        const ultimo =
            listaNova[
                listaNova.length - 1
            ];

        if (
            ultimo &&
            ultimo.tiktok
        ) {

            exibirNovoParticipante(
                ultimo.tiktok
            );

        }

    }

    quantidadeAnterior =
        totalAtual;

}

);

iniciarRotacao();
