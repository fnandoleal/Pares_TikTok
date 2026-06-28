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

let ultimoEstado = -1;

/*
========================================
NOME EM DESTAQUE
========================================
*/

function mostrarParticipanteDestaque() {

const nome =
    document.getElementById(
        "nomeDestaque"
    );

const propaganda =
    document.getElementById(
        "mensagemDivulgacao"
    );

const total =
    document.getElementById(
        "totalParticipantes"
    );

if (
    !nome ||
    !propaganda ||
    !total
) {
    return;
}

let estado;

do {

    const sorteio =
        Math.random() * 100;

    if (sorteio < 40) {

estado = 1;

}
else if (sorteio < 65) {

estado = 2;

}
else if (sorteio < 80) {

estado = 3;

}
else if (sorteio < 90) {

estado = 4;

}
else if (sorteio < 95) {

estado = 5;

}
else {

estado = 6;

}


}
while (
    estado ===
    ultimoEstado
);

ultimoEstado =
    estado;

if (
    estado === 1
) {

    propaganda.style.display =
        "none";

    nome.style.display =
        "block";

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

    nome.innerHTML =
        sorteado.tiktok;

    return;

}

nome.style.display =
    "none";

propaganda.style.display =
    "block";

if (estado === 2) {

    propaganda.innerHTML =

        `${total.innerHTML} CADASTRADOS
        <br><br>
        QUER PARTICIPAR?
        <br><br>
        tinyurl.com/paresaovivo`;

}

                if (estado === 3) {

                    propaganda.innerHTML =

                    `${total.innerHTML} CADASTRADOS
        <br><br>
        COMBINAÇÃO POR
        <br>
        IDADE E DISTÂNCIA`;

}

                if (estado === 4) {

                    propaganda.innerHTML =

                    `${total.innerHTML} CADASTRADOS
        <br><br>
        RECEBA ATÉ
        <br>
        3 MELHORES PARES`;

}

                if (estado === 5) {

                    propaganda.innerHTML =

                    `${total.innerHTML} CADASTRADOS
        <br><br>
        SEU PERFIL
        <br>
        EXPIRA EM 30 DIAS`;

}

if (estado === 6) {

propaganda.innerHTML =

    `
    DÚVIDAS?

    <br><br>

    PERGUNTE AO

    <br>

    ANFITRIÃO
    `;

}


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

                /*
                ========================================
                NOVO PARTICIPANTE
                ========================================
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
            (documento) => {

                const perfil =
                    documento.data();

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

                    let perfilRecente =
                    null;

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

        }

    }

                    );

                    iniciarRotacao();