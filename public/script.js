document.getElementById("transaction-form").addEventListener("submit", async (e) => {});
document.getElementById("service-form").addEventListener("submit", async (e) => {});
document.getElementById("transaction-form").addEventListener("submit", async (e) => {
    e.preventDefault();
});

// Referencias de los formularios
const transactionForm = document.getElementById("transaction-form");
const serviceForm = document.getElementById("service-form");
const recordsTable = document.getElementById("records-table");
const showLogsButton = document.getElementById("show-logs");

// Registrar transacción
transactionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const account = document.getElementById("account").value;
    const sourceAccount = document.getElementById("source-account").value;
    const type = document.getElementById("type").value;
    const amount = document.getElementById("amount").value;
    const date = document.getElementById("date").value;

    try {
        const response = await fetch("/api/transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account, type, amount, date, sourceAccount }),
        });

        const data = await response.json();
        alert(data.message);
        transactionForm.reset();
        updateRecordsTable();
    } catch (error) {
        console.error("Error al registrar transacción:", error);
    }
});

// Registrar servicio
serviceForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const account = document.getElementById("service-account").value;
    const serviceType = document.getElementById("service-type").value;
    const serviceAmount = document.getElementById("service-amount").value;
    const serviceDate = document.getElementById("service-date").value;

    try {
        const response = await fetch("/api/service", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account, serviceType, serviceAmount, serviceDate }),
        });

        const data = await response.json();
        alert(data.message);
        serviceForm.reset();
        updateRecordsTable();
    } catch (error) {
        console.error("Error al registrar servicio:", error);
    }
});

// Actualizar tabla de registros
async function updateRecordsTable() {
    try {
        const response = await fetch("/api/records");
        const { transactions, services } = await response.json();

        recordsTable.innerHTML = "";

        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.account}</td>
                <td>${transaction.type}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.date}</td>
                <td>${transaction.sourceAccount || "N/A"}</td>
            `;
            recordsTable.appendChild(row);
        });

        services.forEach((service) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${service.account}</td>
                <td>Servicio (${service.serviceType})</td>
                <td>${service.serviceAmount}</td>
                <td>${service.serviceDate}</td>
                <td>N/A</td>
            `;
            recordsTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error al obtener registros:", error);
    }
}

// Mostrar logs (botón)
showLogsButton.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/records");
        const { logs } = await response.json();

        alert(`Logs recientes:\n${logs.map((log) => `${log.timestamp}: ${log.type} - ${JSON.stringify(log.details)}`).join("\n")}`);
    } catch (error) {
        console.error("Error al mostrar logs:", error);
    }
});

// Cargar tabla al inicio
updateRecordsTable();





