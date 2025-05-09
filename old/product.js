const DB_NAME = "SiteStorage";
const STORE_NAME = "products";

let reset = false;
let db;

// Retrieve search history from localStorage
let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
let prevSearch = searchHistory.length > 0 ? searchHistory[searchHistory.length - 1] : null;

// Open the IndexedDB database
const request = indexedDB.open(DB_NAME, 1);

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("IndexedDB initialized successfully.");
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
        let product = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        product.createIndex("search_term", "search_term", { unique: false });
    }
};

// Function to save data to IndexedDB
function saveToIndexedDB(data) {
    if (!db) {
        console.error("IndexedDB not initialized yet.");
        return;
    }

    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const addRequest = store.add(data);

    addRequest.onsuccess = () => console.log("Data saved to IndexedDB:", data);
    addRequest.onerror = (error) => console.error("Error saving data:", error);
}

// Initialize Pusher
var pusher = new Pusher("8018b9bc86b3bc4a7fab", { cluster: "ap4" });
var channel = pusher.subscribe("product");

channel.bind("product-data", function (data) {
    console.log("Received data:", data);
    
    saveToIndexedDB(data); 

    const productContainer = document.getElementById("productContainer");
    if (reset) {
        productContainer.innerHTML = "";
        reset = false;
    }
    document.getElementById("load").classList.add("hidden");

    let container = createProductElement(data);
    productContainer.appendChild(container);
});

function createProductElement(data) {
    const container = document.createElement("div");
    container.classList.add("product-item");

    // Title
    const title = document.createElement("b");
    title.textContent = data.title;
    container.appendChild(title);

    // Price
    const price = document.createElement("p");
    price.textContent = "$" + data.price;
    container.appendChild(price);

    // Create an anchor element
    const link = document.createElement("a");
    link.href = data.url;
    link.target = "_blank"; 

    // Create an image element
    const image = document.createElement("img");
    image.src = data.img;
    image.alt = "Product Image";
    image.style.width = "100%"; 
    image.style.borderRadius = "8px"; 

    // Append the image to the anchor
    link.appendChild(image);
    container.appendChild(link);

    return container;
}

function StartScrape() {
    let searchInput = document.getElementById("searchInput").value.trim();

    if (searchInput === "") {
        alert("Please enter a search term.");
        return;
    }

    prevSearch = searchHistory.length > 0 ? searchHistory[searchHistory.length - 1] : null;

    searchHistory.push(searchInput);
    localStorage.setItem("history", JSON.stringify(searchHistory));

    reset = true;
    populateSearchDropdown();

    document.getElementById("load").classList.remove("hidden");

    fetch("http://127.0.0.1:5000/start_scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchInput }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
}

function LastSearch() {
    let dropdown = document.getElementById("searchHistoryDropdown");
    let selectedSearch = dropdown.value;

    if (!selectedSearch) {
        console.log("No previous searches selected.");
        return;
    }

    console.log("Fetching results for:", selectedSearch);

    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    let transaction = db.transaction(STORE_NAME, "readonly");
    let store = transaction.objectStore(STORE_NAME);
    let index = store.index("search_term");

    let request = index.getAll(selectedSearch);

    request.onsuccess = function (event) {
        let records = event.target.result;
        if (records.length === 0) {
            console.log("No records found for this search.");
            return;
        }

        records.forEach((record) => {
            productContainer.appendChild(createProductElement(record));
        });
    };
}

function populateSearchDropdown() {
    let dropdown = document.getElementById("searchHistoryDropdown");
    dropdown.innerHTML = '<option value="">Select a previous search</option>';

    let searchHistory = JSON.parse(localStorage.getItem("history")) || [];

    searchHistory.reverse().forEach((search) => {
        let option = document.createElement("option");
        option.value = search;
        option.textContent = search;
        dropdown.appendChild(option);
    });
}
populateSearchDropdown();
