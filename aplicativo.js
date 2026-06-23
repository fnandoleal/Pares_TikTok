/*
========================================
IMPORTA O FIREBASE
========================================
*/

import {
    bancoDados
}
    from "./configuracao-firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    deleteDoc,
    updateDoc,
    doc
}
    from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/*
========================================
SALVAR PERFIL
========================================
*/

window.salvarPerfil =
    async function () {

        const tiktok =
            document
                .getElementById("tiktok")
                .value
                .trim()
                .toLowerCase();

        const estado =
            document
                .getElementById("estado")
                .value;

        const cidade =
            document
                .getElementById("cidade")
                .value
                .trim()
                .toLowerCase();

        const idade =
            Number(
                document
                    .getElementById("idade")
                    .value
            );

        const sexo =
            document
                .getElementById("sexo")
                .value;

        const situacao =
            document
                .getElementById("situacao")
                .value;

        /*
        Verifica preenchimento
        */

        if (
            tiktok === "" ||
            estado === "" ||
            cidade === "" ||
            idade === 0 ||
            sexo === ""
        ) {
            alert(
                "Preencha todos os campos."
            );

            return;
        }

        try {

            /*
            ========================================
            VERIFICA DUPLICIDADE
            ========================================
            */

            const consultaTikTok =
                query(
                    collection(
                        bancoDados,
                        "perfis"
                    ),
                    where(
                        "tiktok",
                        "==",
                        tiktok
                    )
                );

            const resultado =
                await getDocs(
                    consultaTikTok
                );

            if (
                !resultado.empty
            ) {
                alert(
                    "Este TikTok já está cadastrado."
                );

                return;
            }

            /*
            ========================================
            SALVA NO FIRESTORE
            ========================================
            */

            await addDoc(
                collection(
                    bancoDados,
                    "perfis"
                ),
                {
                    tiktok,
                    estado,
                    cidade,
                    idade,
                    sexo,
                    situacao
                }
            );

            alert(
                "Perfil salvo com sucesso."
            );

            /*
            Limpa formulário
            */

            document
                .getElementById("tiktok")
                .value = "";

            document
                .getElementById("estado")
                .value = "";

            document
                .getElementById("cidade")
                .value = "";

            document
                .getElementById("idade")
                .value = "";

            document
                .getElementById("sexo")
                .value = "";

            document
                .getElementById("situacao")
                .value = "ativo";

        }
        catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao salvar."
            );

        }

    };

/*
========================================
LISTAR PERFIS
========================================
*/

window.carregarPerfis =
    async function () {

        const areaPerfis =
            document.getElementById(
                "areaPerfis"
            );

        if (!areaPerfis) {
            return;
        }

        areaPerfis.innerHTML = "";

        const consulta =
            await getDocs(
                collection(
                    bancoDados,
                    "perfis"
                )
            );

        consulta.forEach(
            (documento) => {

                const perfil =
                    documento.data();

                const idDocumento =
                    documento.id;

                areaPerfis.innerHTML +=
                    `
            <div class="card mb-3">

                <div class="card-body">

                    <h5>
                        ${perfil.tiktok}
                    </h5>

                    <p>

                        <strong>Estado:</strong>
                        ${perfil.estado}

                        <br>

                        <strong>Cidade:</strong>
                        ${perfil.cidade}

                        <br>

                        <strong>Idade:</strong>
                        ${perfil.idade}

                        <br>

                        <strong>Sexo:</strong>

                        ${perfil.sexo === "H"
                        ? "Homem"
                        : "Mulher"
                    }

                        <br>

                        <strong>Situação:</strong>
                        ${perfil.situacao}

                    </p>

<div class="d-flex gap-2 flex-wrap">
<button
    class="btn btn-secondary"
    onclick="editarPerfil('${idDocumento}')">

    Editar

</button>
    <button
        class="btn btn-warning"
        onclick="alternarSituacao(
            '${idDocumento}',
            '${perfil.situacao}'
        )">

        ${perfil.situacao === "ativo"
                        ? "Inativar"
                        : "Ativar"
                    }

    </button>

    <button
        class="btn btn-danger"
        onclick="excluirPerfil('${idDocumento}')">

        Excluir

    </button>

    <a
    href="pares.html?id=${idDocumento}"
    class="btn btn-primary">

    Ver Pares

</a>

<button
    class="btn btn-info"
    onclick="copiarTikTok(
        '${perfil.tiktok}'
    )">

    Copiar TikTok

</button>

</div>


                </div>

            </div>
            `;

            }
        );

    };

/*
========================================
EXCLUIR PERFIL
========================================
*/

window.excluirPerfil =
    async function (idDocumento) {

        const confirmar =
            confirm(
                "Deseja realmente excluir este perfil?"
            );

        if (!confirmar) {
            return;
        }

        try {

            await deleteDoc(
                doc(
                    bancoDados,
                    "perfis",
                    idDocumento
                )
            );

            alert(
                "Perfil excluído."
            );

            carregarPerfis();

        }
        catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao excluir perfil."
            );

        }

    };

/*
========================================
ATIVAR / INATIVAR
========================================
*/

window.alternarSituacao =
    async function (
        idDocumento,
        situacaoAtual
    ) {

        try {

            const novaSituacao =
                situacaoAtual === "ativo"
                    ? "inativo"
                    : "ativo";

            await updateDoc(
                doc(
                    bancoDados,
                    "perfis",
                    idDocumento
                ),
                {
                    situacao:
                        novaSituacao
                }
            );

            carregarPerfis();

        }
        catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao alterar situação."
            );

        }

    };

/*
========================================
EDITAR PERFIL
========================================
*/

window.editarPerfil =
    async function (idDocumento) {

        try {

            const documentoPerfil =
                await getDoc(
                    doc(
                        bancoDados,
                        "perfis",
                        idDocumento
                    )
                );

            const perfil =
                documentoPerfil.data();

            const novoTikTok =
                prompt(
                    "TikTok:",
                    perfil.tiktok
                );

            if (
                novoTikTok === null
            ) {
                return;
            }

            const novoEstado =
                prompt(
                    "Estado:",
                    perfil.estado
                );

            if (
                novoEstado === null
            ) {
                return;
            }

            const novaCidade =
                prompt(
                    "Cidade:",
                    perfil.cidade
                );

            if (
                novaCidade === null
            ) {
                return;
            }

            const novaIdade =
                prompt(
                    "Idade:",
                    perfil.idade
                );

            if (
                novaIdade === null
            ) {
                return;
            }

            await updateDoc(
                doc(
                    bancoDados,
                    "perfis",
                    idDocumento
                ),
                {
                    tiktok:
                        novoTikTok
                            .trim()
                            .toLowerCase(),

                    estado:
                        novoEstado
                            .trim()
                            .toUpperCase(),

                    cidade:
                        novaCidade
                            .trim()
                            .toLowerCase(),

                    idade:
                        Number(
                            novaIdade
                        )
                }
            );

            alert(
                "Perfil atualizado."
            );

            carregarPerfis();

        }
        catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao editar perfil."
            );

        }

    };
window.copiarTikTok =
    async function (tiktok) {

        try {

            await navigator.clipboard.writeText(
                tiktok
            );

            alert(
                "TikTok copiado."
            );

        }
        catch (erro) {

            alert(
                "Não foi possível copiar."
            );

        }

    };
/*
========================================
CARREGAR PARES
========================================
*/

window.carregarPares =
    async function () {

        const parametros =
            new URLSearchParams(
                window.location.search
            );

        const idPerfil =
            parametros.get("id");

        const areaPares =
            document.getElementById(
                "areaPares"
            );

        if (!areaPares) {
            return;
        }

        const documentoPerfil =
            await getDoc(
                doc(
                    bancoDados,
                    "perfis",
                    idPerfil
                )
            );

        const perfil =
            documentoPerfil.data();

        const sexoProcurado =
            perfil.sexo === "H"
                ? "M"
                : "H";

        const consulta =
            await getDocs(
                collection(
                    bancoDados,
                    "perfis"
                )
            );

        areaPares.innerHTML = "";

        const listaPares = [];

        consulta.forEach(
            (documento) => {

                if (
                    documento.id === idPerfil
                ) {
                    return;
                }

                const outroPerfil =
                    documento.data();

                if (
                    outroPerfil.situacao !== "ativo"
                ) {
                    return;
                }

                if (
                    outroPerfil.sexo !== sexoProcurado
                ) {
                    return;
                }

                const diferencaIdade =
                    Math.abs(
                        outroPerfil.idade -
                        perfil.idade
                    );

                listaPares.push(
                    {
                        mesmaCidade:
                            outroPerfil.cidade === perfil.cidade,

                        mesmoEstado:
                            outroPerfil.estado === perfil.estado,

                        diferencaIdade,

                        perfil: outroPerfil
                    }
                );

            }
        );

        listaPares.sort(
            (a, b) => {

                if (
                    a.mesmaCidade &&
                    !b.mesmaCidade
                ) {
                    return -1;
                }

                if (
                    !a.mesmaCidade &&
                    b.mesmaCidade
                ) {
                    return 1;
                }

                if (
                    a.mesmoEstado &&
                    !b.mesmoEstado
                ) {
                    return -1;
                }

                if (
                    !a.mesmoEstado &&
                    b.mesmoEstado
                ) {
                    return 1;
                }

                return (
                    a.diferencaIdade -
                    b.diferencaIdade
                );

            }
        );

        if (
            listaPares.length === 0
        ) {

            areaPares.innerHTML =
                `
                <div class="alert alert-warning">

                    Nenhum par encontrado.

                </div>
                `;

            return;
        }

        areaPares.innerHTML =
            `
            <div class="alert alert-success">

                Pares encontrados:
                ${listaPares.length}

            </div>
            `;

        listaPares.forEach(
            (item) => {

                const outroPerfil =
                    item.perfil;

                areaPares.innerHTML +=
                    `
                    <div class="card mb-3">

                        <div class="card-body">

                            <h5>
                                ${outroPerfil.tiktok}
                            </h5>

                            <p>

                                <strong>Estado:</strong>
                                ${outroPerfil.estado}

                                <br>

                                <strong>Cidade:</strong>
                                ${outroPerfil.cidade}

                                <br>

                                <strong>Idade:</strong>
                                ${outroPerfil.idade}

                            </p>

                        </div>

                    </div>
                    `;

            }
        );

    };