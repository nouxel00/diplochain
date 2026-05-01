const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { contract } = require("./diplochain");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test de vie de l'API
app.get("/", (req, res) => {
  res.json({ message: "DiploChain API opérationnelle 🚀" });
});

// ✅ Accréditer un établissement (admin seulement)
app.post("/accrediter", async (req, res) => {
  try {
    const { adresse, nom } = req.body;
    const tx = await contract.accrediterEtablissement(adresse, nom);
    await tx.wait();
    res.json({ success: true, transaction: tx.hash });
  } catch (error) {
    res.status(500).json({ success: false, erreur: error.message });
  }
});

// ✅ Émettre un diplôme
app.post("/emettre", async (req, res) => {
  try {
    const { nom, prenom, mention, filiere, niveau, annee } = req.body;
    const tx = await contract.emettreDiplome(nom, prenom, mention, filiere, niveau, annee);
    const receipt = await tx.wait();
    const hash = receipt.logs[0].topics[1];
    res.json({ success: true, hashDiplome: hash, transaction: tx.hash });
  } catch (error) {
    res.status(500).json({ success: false, erreur: error.message });
  }
});

// ✅ Vérifier un diplôme (gratuit, sans transaction)
app.get("/verifier/:hash", async (req, res) => {
  try {
    const result = await contract.verifierDiplome(req.params.hash);
    res.json({
      success: true,
      estValide: result[0],
      nom: result[1],
      prenom: result[2],
      etablissement: result[3]
    });
  } catch (error) {
    res.status(500).json({ success: false, erreur: "Diplôme introuvable" });
  }
});

// ✅ Révoquer un diplôme
app.post("/revoquer", async (req, res) => {
  try {
    const { hash } = req.body;
    const tx = await contract.revoquerDiplome(hash);
    await tx.wait();
    res.json({ success: true, transaction: tx.hash });
  } catch (error) {
    res.status(500).json({ success: false, erreur: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DiploChain API démarrée sur le port ${PORT} ✅`);
});