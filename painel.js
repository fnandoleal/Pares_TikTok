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

let ultimaAprovacao = 0;

/*

# NOME EM DESTAQUE

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

/*

# ROTAÇÃO ALEATÓRIA

*/

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

/*

# NOVO PARTICIPANTE

*/

function exibirNovoParticipante(
tiktok
) {

const painelPrincipal =

    document.getElementById(
        "painelPrincipal"
    );

const area =

    document.getElementById(
        "novoCadastro"
    );

if (
    !painelPrincipal ||
    !area
) {
    return;
}

painelPrincipal.style.display =
    "none";

area.style.display =
    "flex";

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

        painelPrincipal.style.display =
            "flex";

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

    let perfilRecente = null;

listaNova.forEach(
    (perfil) => {

        if (

            perfil.dataAprovacaoPainel &&

            perfil.dataAprovacaoPainel >
            ultimaAprovacao

        ) {

            ultimaAprovacao =
                perfil.dataAprovacaoPainel;

            perfilRecente =
                perfil;

        }

    }
);

if (
    perfilRecente
) {

    animarTotal();

    exibirNovoParticipante(
        perfilRecente.tiktok
    );

} {

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
