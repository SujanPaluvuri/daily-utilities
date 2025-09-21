document.addEventListener("DOMContentLoaded", function () {
    const simpleRadio = document.getElementById("simple");
    const compoundRadio = document.getElementById("compound");
    const frequencyContainer = document.getElementById("frequency-container");
    const calculateBtn = document.getElementById("calculateBtn");
    const downloadBtn = document.getElementById("downloadPDF");
    const resultDiv = document.getElementById("result");
    const historyUl = document.getElementById("history");

    let calculations = JSON.parse(localStorage.getItem("calculations")) || [];

    // Show/hide frequency for compound
    document.querySelectorAll('input[name="interestType"]').forEach(radio => {
        radio.addEventListener("change", function () {
            frequencyContainer.style.display = compoundRadio.checked ? "block" : "none";
        });
    });

    // Display history on load
    renderHistory();

    calculateBtn.addEventListener("click", function () {
        const principal = parseFloat(document.getElementById("principal").value);
        const rate = parseFloat(document.getElementById("rate").value);
        const time = parseFloat(document.getElementById("time").value);
        const interestType = document.querySelector('input[name="interestType"]:checked').value;
        const frequency = interestType === "compound" ? parseInt(document.getElementById("frequency").value) : 1;

        if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
            resultDiv.innerHTML = "❌ Please enter valid values.";
            return;
        }

        let totalAmount = 0;
        if (interestType === "simple") {
            totalAmount = principal + (principal * rate * time) / 100;
        } else {
            totalAmount = principal * Math.pow(1 + (rate / (100 * frequency)), frequency * time);
        }

        resultDiv.innerHTML = `✅ Total Amount: ₹${totalAmount.toFixed(2)}`;
        downloadBtn.style.display = "block";

        // Save to localStorage
        const record = {
            type: interestType,
            principal,
            rate,
            time,
            frequency: interestType === "compound" ? frequency : "N/A",
            total: totalAmount.toFixed(2),
            date: new Date().toLocaleString()
        };
        calculations.push(record);
        localStorage.setItem("calculations", JSON.stringify(calculations));

        renderHistory();
    });

    function renderHistory() {
        historyUl.innerHTML = "";
        calculations.slice().reverse().forEach(calc => {
            const li = document.createElement("li");
            li.textContent = `[${calc.date}] ${calc.type} | Principal: ₹${calc.principal}, Rate: ${calc.rate}%, Time: ${calc.time} years | Total: ₹${calc.total}`;
            historyUl.appendChild(li);
        });
    }

    // PDF Download
    downloadBtn.addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const lastCalc = calculations[calculations.length - 1];

        doc.setFont("helvetica", "bold");
        doc.text("Interest Calculation Result", 20, 20);

        doc.setFont("helvetica", "normal");
        doc.text(`Interest Type: ${lastCalc.type}`, 20, 40);
        doc.text(`Principal Amount: ₹${lastCalc.principal}`, 20, 50);
        doc.text(`Interest Rate: ${lastCalc.rate}%`, 20, 60);
        doc.text(`Time Period: ${lastCalc.time} years`, 20, 70);
        doc.text(`Compounding Frequency: ${lastCalc.frequency}`, 20, 80);
        doc.text(`Total Amount: ₹${lastCalc.total}`, 20, 90);

        doc.save("Interest_Calculation_Result.pdf");
    });
});
