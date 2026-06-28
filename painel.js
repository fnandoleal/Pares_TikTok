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

    const sorteado =

        participantes[
            Math.floor(
                Math.random() *
                participantes.length
            )
        ];

    const nome =

        document.getElementById(
            "nomeDestaque"
        );

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

/*
========================================
ROTAÇÃO ALEATÓRIA
========================================
*/

function iniciarRotacao() {

    mostrarParticipanteDestaque();

    const tempoAleatorio =

        Math.floor(
            Math.random() * 2001
        )

        + 8000;

    setTimeout(
        iniciarRotacao,
        tempoAleatorio
    );

}

/*
========================================
NOVO PARTICIPANTE
========================================
*/

function exibirNovoParticipante(
    tiktok
) {

    const area =
        document.getElementById(
            "novoCadastro"
        );

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
        )

        + 30000;

    setTimeout(
        () => {

            area.style.display =
                "none";

        },
        tempoAleatorio
    );

}

/*
========================================
FIREBASE
========================================
*/

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
                ) {

                    listaNova.push(
                        perfil
                    );

                }

            }
        );

        participantes =
            listaNova;

        document.getElementById(
            "totalParticipantes"
        ).innerHTML =

            listaNova.length;

        if (

            quantidadeAnterior > 0 &&

            listaNova.length >
            quantidadeAnterior

        ) {

            const ultimo =

                listaNova[
                    listaNova.length - 1
                ];

            exibirNovoParticipante(
                ultimo.tiktok
            );

        }

        quantidadeAnterior =
            listaNova.length;

    }

);

iniciarRotacao();