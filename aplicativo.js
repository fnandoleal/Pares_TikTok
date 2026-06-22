/*
========================================
IMPORTA O FIREBASE
========================================
*/

import
{
    bancoDados
}
from "./configuracao-firebase.js";

import
{
     collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    deleteDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/*
========================================
SALVAR PERFIL
========================================
*/

window.salvarPerfil =
async function ()
{

    const tiktok =
        document
        .getElementById("tiktok")
        .value
        .trim()
        .toLowerCase();

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

    if(
        tiktok === "" ||
        cidade === "" ||
        idade === 0 ||
        sexo === ""
    )
    {
        alert(
            "Preencha todos os campos."
        );

        return;
    }

    try
    {

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

        if(
            !resultado.empty
        )
        {
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
    catch(erro)
    {

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
async function ()
{

    const areaPerfis =
        document.getElementById(
            "areaPerfis"
        );

    if(!areaPerfis)
    {
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
        (documento) =>
        {

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

                        <strong>Cidade:</strong>
                        ${perfil.cidade}

                        <br>

                        <strong>Idade:</strong>
                        ${perfil.idade}

                        <br>

                        <strong>Sexo:</strong>

                        ${
                            perfil.sexo === "H"
                            ? "Homem"
                            : "Mulher"
                        }

                        <br>

                        <strong>Situação:</strong>
                        ${perfil.situacao}

                    </p>

<div class="d-flex gap-2">

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
async function(idDocumento)
{

    const confirmar =
        confirm(
            "Deseja realmente excluir este perfil?"
        );

    if(!confirmar)
    {
        return;
    }

    try
    {

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
    catch(erro)
    {

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
CARREGAR PARES
========================================
*/

/*
========================================
CARREGAR PARES
========================================
*/

window.carregarPares =
async function()
{

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

    if(!areaPares)
    {
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

    consulta.forEach(
        (documento) =>
        {

            if(documento.id === idPerfil)
            {
                return;
            }

            const outroPerfil =
                documento.data();

            if(outroPerfil.situacao !== "ativo")
            {
                return;
            }

            if(outroPerfil.sexo !== sexoProcurado)
            {
                return;
            }

            areaPares.innerHTML +=
            `
            <div class="card mb-3">

                <div class="card-body">

                    <h5>
                        ${outroPerfil.tiktok}
                    </h5>

                    <p>

                        Cidade:
                        ${outroPerfil.cidade}

                        <br>

                        Idade:
                        ${outroPerfil.idade}

                    </p>

                </div>

            </div>
            `;

        }
    );

};