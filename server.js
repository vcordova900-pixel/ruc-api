const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/consultar", async (req, res) => {

    let rucs = req.body.rucs;
    let resultados = [];

    for (let ruc of rucs) {
        try {
            let response = await axios.get(`https://api.apis.net.pe/v1/ruc?numero=${ruc}`);

            resultados.push({
                ruc: ruc,
                nombre: response.data.nombre || "NO DATA"
            });

        } catch {
            resultados.push({
                ruc: ruc,
                nombre: "ERROR"
            });
        }
    }

    res.json(resultados);
});

app.listen(3000);