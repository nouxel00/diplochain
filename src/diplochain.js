const { ethers } = require("ethers");
require("dotenv").config();

const ABI = [
  "function accrediterEtablissement(address _etab, string memory _nom) public",
  "function emettreDiplome(string memory _nom, string memory _prenom, string memory _mention, string memory _filiere, string memory _niveau, uint256 _annee) public returns (bytes32)",
  "function verifierDiplome(bytes32 _hash) public view returns (bool, string memory, string memory, string memory)",
  "function revoquerDiplome(bytes32 _hash) public",
  "function reActiverDiplome(bytes32 _hash) public",
  "function etablissements(address) public view returns (bool)",
  "function nomsEtablissements(address) public view returns (string)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);

module.exports = { contract, wallet };