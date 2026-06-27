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

let ultimoExibido = null;

/*
========================================
MOSTRAR PARTICIPANTES
========================================
*/

function mostrarParticipantesAleatorios() {

    const area =
        document.getElementById(
            "listaAleatoria"
        );

    if (!area) {
        return;
    }

    area.innerHTML = "";

    const embaralhados =
        [...participantes]
            .sort(
                () =>
                    Math.random() - 0.5
            );

    const sorteados =
        embaralhados.slice(
            0,
            5
        );

    sorteados.forEach(
        (perfil) => {

            area.innerHTML +=
                `
                <div class="participante">

                    ${perfil.tiktok}

                </div>
                `;

        }
    );

}

/*
========================================
ROTAÇÃO ALEATÓRIA
========================================
*/

function iniciarRotacao() {

    mostrarParticipantesAleatorios();

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

    if (!area) {
        return;
    }

    area.style.display =
        "block";

    area.innerHTML =
        `
        <div class="alertaNovo">

            🎉 NOVO PARTICIPANTE

            <br><br>

            ${tiktok}

        </div>
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

        document.getElementById(
            "totalParticipantes"
        ).innerHTML =

            listaNova.length;

        if (
            quantidadeAnterior > 0 &&
            listaNova.length >
            quantidadeAnterior
        ) {

            const novoPerfil =

                listaNova.find(
                    p =>
                        p.tiktok !==
                        ultimoExibido
                );

            if (
                novoPerfil
            ) {

                ultimoExibido =
                    novoPerfil.tiktok;

                exibirNovoParticipante(
                    novoPerfil.tiktok
                );

            }

        }

        participantes =
            listaNova;

        quantidadeAnterior =
            listaNova.length;

    }

);

iniciarRotacao();