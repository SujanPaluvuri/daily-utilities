const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');

// Fetch quotes from local JSON file
async function fetchQuotes() {
    try {
        const response = await fetch('quotes.json');
        if (!response.ok) throw new Error('Failed to load quotes.json');
        
        const quotes = await response.json();
        displayRandomQuote(quotes);
        
        // New Quote button
        newQuoteBtn.addEventListener('click', () => displayRandomQuote(quotes));
    } catch (error) {
        quoteText.textContent = "Oops! Could not load quotes.";
        authorText.textContent = "";
        console.error("Quote fetch error:", error);
    }
}

// Display random quote
function displayRandomQuote(quotes) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteText.textContent = `"${quote.quote}"`;
    authorText.textContent = `- ${quote.author}`;
}

// Initialize
fetchQuotes();
