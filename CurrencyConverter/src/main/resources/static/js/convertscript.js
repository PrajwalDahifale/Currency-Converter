const apiKey = '921541f60ee967921f203e2d1a43407a'; // Replace with your API Key
const apiUrl = `https://data.fixer.io/api/latest?access_key=${apiKey}`;

document.addEventListener("DOMContentLoaded", function () {
    loadCurrencies();
});

async function loadCurrencies() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success) {
            throw new Error("Failed to fetch currency data.");
        }

        const currencyDropdowns = [document.getElementById("fromCurrency"), document.getElementById("toCurrency")];
        const rates = data.rates;

        currencyDropdowns.forEach(dropdown => {
            dropdown.innerHTML = "";
            for (const currency in rates) {
                let option = new Option(currency, currency);
                dropdown.add(option);
            }
        });

        document.getElementById("fromCurrency").value = "USD";
        document.getElementById("toCurrency").value = "INR";
    } catch (error) {
        console.error("Error loading currencies:", error);
    }
}

async function convertCurrency() {
    const amount = document.getElementById("amount").value;
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success) {
            throw new Error("Failed to fetch currency rates.");
        }

        const rates = data.rates;
        if (!rates[fromCurrency] || !rates[toCurrency]) {
            throw new Error("Invalid currency selection.");
        }

        const convertedAmount = (amount / rates[fromCurrency]) * rates[toCurrency];
        document.getElementById("result").textContent = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.error("Error converting currency:", error);
    }
}