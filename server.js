const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function consultarRUC(ruc) {

    for (let i = 0; i < 3; i++) {
        try {
            let response = await axios.get(`https://api.apis.net.pe/v1/ruc?numero=${ruc}`);

            return {
                ruc: ruc,
                nombre: response.data.nombre || "",
                estado: response.data.estado || "",
                condicion: response.data.condicion || "",
                direccion: response.data.direccion || "",
                distrito: response.data.distrito || "",
                provincia: response.data.provincia || "",
                departamento: response.data.departamento || ""
            };

        } catch (e) {
            await sleep(500);
        }
    }

    return {
        ruc: ruc,
        nombre: "NO ENCONTRADO",
        estado: "-",
        condicion: "-",
        direccion: "-",
        distrito: "-",
        provincia: "-",
        departamento: "-"
    };
}

app.post("/consultar", async (req, res) => {

    let rucs = req.body.rucs;
    let resultados = [];

    for (let ruc of rucs) {

        let data = await consultarRUC(ruc.trim());
        resultados.push(data);

        await sleep(300); // 🔥 clave anti bloqueo
    }

    res.json(resultados);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor listo"));
