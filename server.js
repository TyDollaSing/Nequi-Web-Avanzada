const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Data Storage
let accounts = {};
let transactions = [];
let services = [];
let logs = [];

// Utility: Add Logs
const addLog = (type, details) => {
    const log = {
        type,
        details,
        timestamp: new Date().toISOString(),
    };
    logs.push(log);

    // Export to Excel
    const filePath = path.join(__dirname, "data", "logs.xlsx");
    const workbook = fs.existsSync(filePath) ? xlsx.readFile(filePath) : xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(logs);

    workbook.SheetNames[0] = "Logs";
    workbook.Sheets["Logs"] = worksheet;
    xlsx.writeFile(workbook, filePath);
};

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Registrar Transacción
app.post("/api/transaction", (req, res) => {
    const { account, type, amount, date, sourceAccount } = req.body;

    if (!account || !type || !amount || !date) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (!accounts[account]) accounts[account] = 0;

    const numericAmount = parseFloat(amount);
    if (type === "deposit") {
        accounts[account] += numericAmount;
    } else if (type === "withdrawal") {
        if (accounts[account] < numericAmount) {
            return res.status(400).json({ message: "Saldo insuficiente." });
        }
        accounts[account] -= numericAmount;
    }

    const transaction = { account, type, amount: numericAmount, date, sourceAccount };
    transactions.push(transaction);
    addLog("Transacción", transaction);
    res.status(201).json({ message: "Transacción registrada exitosamente.", balance: accounts[account], transaction });
});

// Registrar Servicio
app.post("/api/service", (req, res) => {
    const { account, serviceType, serviceAmount, serviceDate } = req.body;

    if (!account || !serviceType || !serviceAmount || !serviceDate) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (!accounts[account] || accounts[account] < parseFloat(serviceAmount)) {
        return res.status(400).json({ message: "Saldo insuficiente." });
    }

    accounts[account] -= parseFloat(serviceAmount);

    const service = { account, serviceType, serviceAmount: parseFloat(serviceAmount), serviceDate };
    services.push(service);
    addLog("Servicio", service);
    res.status(201).json({ message: "Servicio registrado exitosamente.", balance: accounts[account], service });
});

// Obtener Registros
app.get("/api/records", (req, res) => {
    res.status(200).json({ transactions, services, logs });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});





