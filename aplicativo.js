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
    query,
    where
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
        .trim();

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
VERIFICA SE O TIKTOK JÁ EXISTE
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
        Salva no Firestore
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

            areaPerfis.innerHTML +=
            `
            <div class="card mb-3">

                <div class="card-body">

                    <h5>
                        ${perfil.tiktok}
                    </h5>

                    <p>
                        ${perfil.idade} anos
                        <br>
                        ${perfil.cidade}
                    </p>

                    <p>
                        Sexo:
                        ${
                            perfil.sexo === "H"
                            ? "Homem"
                            : "Mulher"
                        }
                    </p>

                    <p>
                        Situação:
                        ${perfil.situacao}
                    </p>

                </div>

            </div>
            `;

        }
    );

};