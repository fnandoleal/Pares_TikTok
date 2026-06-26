/*
========================================
CARREGAR CIDADES
========================================
*/

window.carregarCidades =
    async function () {

        const estado =
            document
                .getElementById("estado")
                .value;

        const cidade =
            document
                .getElementById("cidade");

        if (
            estado === ""
        ) {
            return;
        }

        cidade.innerHTML =
            '<option value="">Carregando...</option>';

        try {

            const resposta =
                await fetch(
                    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
                );

            const municipios =
                await resposta.json();

            cidade.innerHTML =
                '<option value="">Selecione</option>';

            municipios.forEach(
                (municipio) => {

                    cidade.innerHTML +=
                        `
                <option value="${municipio.nome}">
                    ${municipio.nome}
                </option>
                `;

                }
            );

        }
        catch (erro) {

            console.error(
                erro
            );

            cidade.innerHTML =
                '<option value="">Erro ao carregar</option>';

        }

    };
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

            const resposta =
                await fetch(
                    `https://nominatim.openstreetmap.org/search?city=${cidade}&state=${estado}&country=Brazil&format=json&limit=1`
                );

            const dados =
                await resposta.json();

            if (
                dados.length === 0
            ) {
                alert(
                    "Não foi possível localizar a cidade."
                );

                return;
            }

            const latitude =
                Number(
                    dados[0].lat
                );

            const longitude =
                Number(
                    dados[0].lon
                );

            const codigoValidacao =
                "PT-" +
                Math.floor(
                    1000 +
                    Math.random() * 9000
                );

            const dataCadastro =
                new Date()
                    .toISOString();

            await addDoc(
                collection(
                    bancoDados,
                    "perfis"
                ),
                {
                    tiktok,
                    estado,
                    cidade,
                    latitude,
                    longitude,
                    idade,
                    sexo,

                    situacao: "pendente",

                    codigoValidacao,

                    dataCadastro,

                    dataValidacao: null,

                    dataExpiracao: null,

                    moderador: null,

                    origem: "publico"
                }
            );

            document
                .getElementById(
                    "areaCodigo"
                )
                .style.display =
                "block";

            document
                .getElementById(
                    "areaCodigo"
                )
                .innerHTML =
                `
<div class="alert alert-success">

    <h4>

        ✅ Cadastro realizado!

    </h4>

    <p>

        Seu código de validação:

    </p>

    <input
        type="text"
        id="codigoGerado"
        class="form-control text-center fw-bold fs-4 mb-3"
        value="${codigoValidacao}"
        readonly>

    <div class="alert alert-warning">

        1. Copie o código

        <br>

        2. Coloque o código no
        Status do TikTok

        <br>

        3. Aguarde aprovação

        <br><br>

        Após aprovado, solicite a um
        moderador ou administrador do ao vivo
        o envio dos seus 3 principais pares
        pelo privado.

        <br><br>

        ⏳ O cadastro permanece ativo
        por até 30 dias.

        Após esse período será removido
        automaticamente do sistema.

    </div>

    <div class="d-flex gap-2">

        <button
            class="btn btn-primary"
            onclick="copiarCodigo()">

            📋 Copiar Código

        </button>

        <button
            class="btn btn-dark"
            onclick="abrirTikTokCadastro()">

            🎵 Abrir TikTok

        </button>

    </div>

</div>
`;

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

        const busca =
            document
                .getElementById(
                    "buscaTikTok"
                )?.value
                .trim()
                .toLowerCase()
            || "";

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
                if (
                    perfil.situacao !== "ativo"
                ) {
                    return;
                }

                if (
                    busca !== "" &&
                    !perfil.tiktok
                        .toLowerCase()
                        .includes(busca)
                ) {
                    return;
                }

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

                    </p>

<div class="d-flex gap-2 flex-wrap">
<button
    class="btn btn-secondary"
    onclick="editarPerfil('${idDocumento}')">

    Editar

</button>

    <button
    class="btn btn-danger"
    onclick="solicitarExclusao('${idDocumento}')">

    Solicitar Exclusão

</button>

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

                const distancia =
                    calcularDistancia(
                        perfil.latitude,
                        perfil.longitude,
                        outroPerfil.latitude,
                        outroPerfil.longitude
                    );

                const diferencaIdade =
                    Math.abs(
                        outroPerfil.idade -
                        perfil.idade
                    );

                listaPares.push(
                    {
                        distancia,
                        diferencaIdade,
                        perfil: outroPerfil
                    }
                );

            }
        );

        listaPares.sort(
            (a, b) => {

                if (
                    a.distancia !==
                    b.distancia
                ) {
                    return (
                        a.distancia -
                        b.distancia
                    );
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

                const diferenca =
                    item.diferencaIdade;

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

                                <br>

                                <strong>Diferença:</strong>
                                ${diferenca} anos

                                <br>

                                <strong>Distância:</strong>
                                ${Math.round(item.distancia)} km

                            </p>

                        </div>

                    </div>
                    `;

            }
        );

    };
function calcularDistancia(
    lat1,
    lon1,
    lat2,
    lon2
) {
    const R = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI / 180;

    const dLon =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

/*
========================================
CARREGAR PENDENTES
========================================
*/

window.carregarPendentes =
    async function () {

        const areaPendentes =
            document.getElementById(
                "areaPendentes"
            );

        if (!areaPendentes) {
            return;
        }

        areaPendentes.innerHTML = "";

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

                if (
                    perfil.situacao !==
                    "pendente"
                ) {
                    return;
                }

                const idDocumento =
                    documento.id;

                areaPendentes.innerHTML +=
                    `
                    <div class="card mb-3">

                        <div class="card-body">

                            <h5>

                                ${perfil.tiktok}

                            </h5>

                            <p>

                                <strong>Cidade:</strong>
                                ${perfil.cidade}

                                <br>

                                <strong>Estado:</strong>
                                ${perfil.estado}

                                <br>

                                <strong>Idade:</strong>
                                ${perfil.idade}

                                <br>

                                <strong>Código:</strong>
                                ${perfil.codigoValidacao}

                                <br>

                                <strong>Cadastrado:</strong>

                                ${new Date(
                        perfil.dataCadastro
                    ).toLocaleDateString(
                        "pt-BR"
                    )}

                            </p>

                            <div class="d-flex gap-2 flex-wrap">

    <button
        class="btn btn-success"
        onclick="aprovarPerfil('${idDocumento}')">

        Aprovar

    </button>

    <button
        class="btn btn-danger"
        onclick="bloquearPerfil('${idDocumento}')">

        Bloquear

    </button>

    <button
        class="btn btn-info"
        onclick="abrirTikTok('${perfil.tiktok}')">

        Abrir TikTok

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
APROVAR PERFIL
========================================
*/

window.aprovarPerfil =
    async function (idDocumento) {

        try {

            const hoje =
                new Date();

            const expiracao =
                new Date();

            expiracao.setDate(
                expiracao.getDate() + 30
            );

            const moderador =
                prompt(
                    "Nome do moderador:"
                );

            if (
                !moderador
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
                    situacao: "ativo",

                    dataValidacao:
                        hoje.toISOString(),

                    dataExpiracao:
                        expiracao.toISOString(),

                    moderador:
                        moderador

                }
            );

            alert(
                "Perfil aprovado."
            );

            carregarPendentes();

            carregarAtivos();

        }
        catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao aprovar perfil."
            );

        }

    };

/*
========================================
BLOQUEAR PERFIL
========================================
*/

window.bloquearPerfil =
    async function (idDocumento) {

        try {

            await updateDoc(
                doc(
                    bancoDados,
                    "perfis",
                    idDocumento
                ),
                {
                    situacao:
                        "bloqueado"
                }
            );

            alert(
                "Perfil bloqueado."
            );

            carregarPendentes();

            carregarAtivos();

        }
        catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao bloquear perfil."
            );

        }

    };
/*
========================================
ABRIR TIKTOK
========================================
*/

window.abrirTikTok =
    function (tiktok) {

        const usuario =
            tiktok.replace(
                "@",
                ""
            );

        window.open(
            `https://www.tiktok.com/@${usuario}`,
            "_blank"
        );

    };

/*
========================================
CARREGAR ATIVOS
========================================
*/

window.carregarAtivos =
    async function () {

        const areaAtivos =
            document.getElementById(
                "areaAtivos"
            );

        if (!areaAtivos) {
            return;
        }

        areaAtivos.innerHTML = "";

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

                if (
                    perfil.situacao !==
                    "ativo"
                ) {
                    return;
                }

                const idDocumento =
                    documento.id;

                let diasRestantes =
                    "-";

                if (
                    perfil.dataExpiracao
                ) {

                    const hoje =
                        new Date();

                    const expiracao =
                        new Date(
                            perfil.dataExpiracao
                        );

                    diasRestantes =
                        Math.ceil(
                            (
                                expiracao -
                                hoje
                            ) /
                            (
                                1000 *
                                60 *
                                60 *
                                24
                            )
                        );

                }

                areaAtivos.innerHTML +=
                    `
                    <div class="card mb-3">

                        <div class="card-body">

                            <h5>

                                ${perfil.tiktok}

                            </h5>

                            <p>

                                <strong>Validado:</strong>

                                ${perfil.dataValidacao
                        ? new Date(
                            perfil.dataValidacao
                        ).toLocaleDateString(
                            "pt-BR"
                        )
                        : "-"
                    }

                                <br>

                                <strong>Expira:</strong>

                                ${perfil.dataExpiracao
                        ? new Date(
                            perfil.dataExpiracao
                        ).toLocaleDateString(
                            "pt-BR"
                        )
                        : "-"
                    }

                                <br>

                                <strong>Moderador:</strong>

                                ${perfil.moderador || "-"}

                                <br>

                                <strong>Dias restantes:</strong>

                                ${diasRestantes}

                            </p>

                            <button
    class="btn btn-danger"
    onclick="bloquearPerfil('${idDocumento}')">

    Bloquear

</button>

<button
    class="btn btn-primary"
    onclick="gerarCombinacoes('${idDocumento}')">

    Gerar 3 Combinações

</button>

                        </div>

                    </div>
                    `;

            }
        );

    };

/*
========================================
COPIAR CÓDIGO
========================================
*/
window.copiarCodigo =
    async function () {

        try {

            const codigo =
                document
                    .getElementById(
                        "codigoGerado"
                    )
                    .value;

            await navigator
                .clipboard
                .writeText(
                    codigo
                );

            alert(
                "Código copiado."
            );

        }
        catch {

            alert(
                "Erro ao copiar."
            );

        }

    };

/*
========================================
ABRIR TIKTOK CADASTRO
========================================
*/

window.abrirTikTokCadastro =
    function () {

        window.open(
            "https://www.tiktok.com",
            "_blank"
        );

    };

/*
========================================
GERAR COMBINAÇÕES
========================================
*/

window.gerarCombinacoes =
    async function (idPerfil) {

        const areaCombinacoes =
            document.getElementById(
                "areaCombinacoes"
            );

        areaCombinacoes.innerHTML =
            "Gerando combinações...";

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

                const distancia =
                    calcularDistancia(
                        perfil.latitude,
                        perfil.longitude,
                        outroPerfil.latitude,
                        outroPerfil.longitude
                    );

                const diferencaIdade =
                    Math.abs(
                        outroPerfil.idade -
                        perfil.idade
                    );

                listaPares.push(
                    {
                        distancia,
                        diferencaIdade,
                        perfil:
                            outroPerfil
                    }
                );

            }
        );

        listaPares.sort(
            (a, b) => {

                if (
                    a.distancia !==
                    b.distancia
                ) {
                    return (
                        a.distancia -
                        b.distancia
                    );
                }

                return (
                    a.diferencaIdade -
                    b.diferencaIdade
                );

            }
        );

        const melhores =
            listaPares.slice(
                0,
                3
            );

        areaCombinacoes.innerHTML =
            `
            <h4>
                ${perfil.tiktok}
            </h4>
            `;

        melhores.forEach(
            (item) => {

                areaCombinacoes.innerHTML +=
                    `
                    <div class="card mb-2">

                        <div class="card-body">

                            <strong>
                                ${item.perfil.tiktok}
                            </strong>

                            <br>

                            ${Math.round(item.distancia)} km

                            <br>

                            Diferença de idade:
                            ${item.diferencaIdade}

                        </div>

                    </div>
                    `;

            }
        );

    };

    /*
========================================
SOLICITAR EXCLUSÃO
========================================
*/

window.solicitarExclusao =
    async function (idDocumento) {

        alert(
            "Função de exclusão funcionando."
        );

    };