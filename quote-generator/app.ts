interface Quote {
    author?: string;
    tag: string;
    text: string;
}

class Loader {
    loader: HTMLDivElement;
    quoteContainer: HTMLDivElement;

    constructor() {
        this.loader = document.getElementById("loader")! as HTMLDivElement;
        this.quoteContainer = document.getElementById("quote-container")! as HTMLDivElement;
    }

    showLoader(): void {
        this.loader.hidden = false;
        this.quoteContainer.hidden = true;
    }

    hideLoader(): void {
        this.loader.hidden = true;
        this.quoteContainer.hidden = false;
    }
}

class Api {
    static async loadData(apiUrl: string, cnt: number) {
        try {
            const res = await fetch(apiUrl);
            return await res.json();
        } catch (err) {
            alert(`Retry to load data. (${cnt})`);

            if (cnt == 3) {
                alert('Failed to load data from api url.');
                console.log(err);
                return;
            }

            this.loadData(apiUrl, cnt + 1);
        }
    }
}

class QuoteContainer {
    quoteContainer: HTMLDivElement;
    quote: HTMLSpanElement;
    author: HTMLSpanElement;
    newQuoteBtn: HTMLButtonElement;
    twitterBtn: HTMLButtonElement;
    quotes: Quote[];

    constructor(quotes: Quote[]) {
        this.quoteContainer = document.getElementById("quote-container")! as HTMLDivElement;
        this.quote = document.getElementById("quote")! as HTMLSpanElement;
        this.author = document.getElementById("author")! as HTMLSpanElement;
        this.newQuoteBtn = document.getElementById("new-quote")! as HTMLButtonElement;
        this.twitterBtn = document.getElementById("twitter")! as HTMLButtonElement;
        this.quotes = quotes;

        this.renderQuoteText();
        this.configure();
    }

    configure() {
        this.newQuoteBtn.addEventListener('click', this.renderQuoteText.bind(this));
        this.twitterBtn.addEventListener('click', this.shareOnTwitter.bind(this));
    }

    private renderQuoteText(): void {
        const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        this.addLongQuoteClassIfExceedMaxLength(quote.text);
        this.quote.textContent = quote.text;
        this.author.textContent = quote.author ?? 'Unknown';
    }

    private addLongQuoteClassIfExceedMaxLength(quoteText: string): void {
        if (quoteText.length > 120) {
            this.quote.classList.add("long-quote");
            return;
        }
        this.quote.classList.remove("long-quote");
    }

    private shareOnTwitter(_event: Event): void {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${this.quote.textContent} - ${this.author.textContent}`;
        window.open(twitterUrl, "_blank");
    }
}

async function displayQuote() {
    const loader = new Loader();
    loader.showLoader();
    const apiUrl = "https://jacintodesign.github.io/quotes-api/data/quotes.json";
    const quotes = await Api.loadData(apiUrl, 1)! as Quote[];
    new QuoteContainer(quotes);
    loader.hideLoader();
}

displayQuote();
