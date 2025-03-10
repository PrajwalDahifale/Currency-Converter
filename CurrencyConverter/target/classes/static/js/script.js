

// Convert Currency
function convertCurrencyJs() {
    let base = document.getElementById("baseCurrency").value.toUpperCase();
    let target = document.getElementById("targetCurrency").value.toUpperCase();

    fetch(`/api/getExchangeRate?base=${base}&target=${target}`)
	.then(response => {
	                    if (!response.ok) {
	                        throw new Error('Network response was not ok');
	                    }
	                    return response.json(); 
	                })
	                .then(data => {
	                    // Extract and display the conversion rate in the UI
	                    document.getElementById("result").innerText = `Result ${data.base} to ${data.target}: ${data.rate}`;
	                })
	                .catch(error => {
	                    console.error('Error:', error);
	                    document.getElementById("result").innerText = "Error fetching conversion rate.";
	                });
}








const apiKey = "921541f60ee967921f203e2d1a43407a"; // Replace with your  API key
const apiUrl = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=EUR`;

const currencyList = document.getElementById("currency-list");

async function fetchCurrencies() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch currency data.");

    const data = await response.json();
    const rates = data.rates;

    // Define the currencies to display
    const selectedCurrencies = ["USD", "GBP", "JPY", "CAD"];
    const countryFlags = {
		
      USD: "https://flagcdn.com/w320/us.png",
      GBP: "https://flagcdn.com/w320/gb.png",
      JPY: "https://flagcdn.com/w320/jp.png",
      CAD: "https://flagcdn.com/w320/ca.png",
    };

    selectedCurrencies.forEach((currency) => {
      const rate = rates[currency];
      const change = getRandomChange();
      renderCurrencyRow({
        name: getCurrencyName(currency),
        rate: rate.toFixed(5),
        change,
        flagUrl: countryFlags[currency],
      });
    });
  } catch (error) {
    console.error("Error fetching currencies:", error.message);
    alert("Failed to load currencies. Please check your API key or try again later.");
  }
}

// Render a single currency row
function renderCurrencyRow(currency) {
  const div = document.createElement("div");
  div.className = "currency-row";

  // Determine the color based on positive or negative change
  const changeColor = currency.change.includes("-") ? "red" : "green";

  div.innerHTML = `
    <div class="currency-name">
      <img src="${currency.flagUrl}" alt="Flag" class="flag-icon" width="30" height="20">
      <span>${currency.name}</span>
    </div>
    <span>${currency.rate}</span>
    <span class="percentage" style="color: ${changeColor};">${currency.change}</span>
  `;
  currencyList.appendChild(div);
}

// Helper function to generate a random percentage change
function getRandomChange() {
  const change = (Math.random() * 2 - 1).toFixed(2); // Random number between -1 and +1
  return `${change > 0 ? "+" : ""}${change}%`;
}

// Map currency codes to their full names
function getCurrencyName(code) {
  const names = {
    USD: "US Doller",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    CAD: "Canadian Dollar",
  };
  return names[code] || code;
}

// Fetch and display currencies on page load
fetchCurrencies();
