document.addEventListener("DOMContentLoaded", function() {
    loadCurrencies();
});

async function loadCurrencies() {
    try {
        const response = await fetch("/api/show"); // Fetching available currencies
        if (!response.ok) {
            throw new Error("Failed to fetch currencies");
        }

        const data = await response.json();
        console.log("Fetched Currency Data:", data); // Debugging output

        const baseDropdown = document.getElementById("base");
        const targetDropdown = document.getElementById("target");

        if (!baseDropdown || !targetDropdown) {
            console.error("Dropdown elements not found in DOM");
            return;
        }

        baseDropdown.innerHTML = "";  // Clear previous options
        targetDropdown.innerHTML = "";

        // Add default option
        baseDropdown.add(new Option("Select Currency", ""));
        targetDropdown.add(new Option("Select Currency", ""));

		for (const [code, name] of Object.entries(data)) {
		            let option1 = new Option(`${name} (${code})`, code);
		            let option2 = new Option(`${name} (${code})`, code);
		            baseDropdown.add(option1);
		            targetDropdown.add(option2);
		        }
    } catch (error) {
        console.error("Error loading currencies:", error);
    }
}

async function fetchHistoricalData() {
    const base = document.getElementById('base').value;
    const target = document.getElementById('target').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!base || !target || !startDate || !endDate) {
        alert("Please enter all fields.");
        return;
    }

    try {
        const response = await fetch(`/api/historical?base=${base}&target=${target}&startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();

        if (!data || data.length === 0) {
            alert("No historical data found.");
            return;
        }

        console.log("API Response:", data);

        // Extract labels (dates) and rates
        const labels = data.map(entry => entry.timestamp.split("T")[0]); // Extract date
        const rates = data.map(entry => entry.rate);

        if (!labels.length || !rates.length) {
            console.error("Empty labels or rates array");
            alert("No valid data to display.");
            return;
        }

        // ✅ Check if chart exists before destroying it
        if (window.currencyChart instanceof Chart) {
            window.currencyChart.destroy();
        }

        const ctx = document.getElementById('currencyChart').getContext('2d');
        window.currencyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${base} to ${target} Exchange Rate`,
                    data: rates,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: '#0056b3'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Date' }
                    },
                    y: {
                        title: { display: true, text: 'Exchange Rate' }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching historical data:", error);
        alert("Failed to fetch historical data.");
    }

}
