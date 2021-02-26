const apiUrl = "http://localhost:3000/api/teddies";
const productPageUrlFromIndex = "./pages/product.html";

// Récupère une liste d'objets JSON correspondant à tous les items 
const getTeddies = () => {
    const teddies = new Promise((resolve) => {
        let requestAll = new XMLHttpRequest();
        requestAll.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                resolve(JSON.parse(this.responseText));
                console.log("Connection with API OK");
            }
            else {
                console.log("Connection with API failed");
            }
        };
        requestAll.open("GET", apiUrl);
        requestAll.send();
    });
    return teddies;
};

// Récupère l'objet JSON correspondant au produit en fonction de son ID
// Prend en paramètre une valeur liste[index] donnée par la fonction getTeddyById(index)
const getSpecificTeddy = (listSelect) => {
    const specificTeddy = new Promise((resolve) => {
        let requestSpecificTeddy = new XMLHttpRequest();
        requestSpecificTeddy.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                resolve(JSON.parse(this.responseText));
                console.log("Connection with API OK");
            }
            else {
                console.log("Connection with API failed");
            }
        };
        requestSpecificTeddy.open("GET", apiUrl + "/" + listSelect);
        requestSpecificTeddy.send();
    });
    return specificTeddy;
};

// Prend en paramètre une valeur d'index pour la liste contenant les IDs de tous les produits
// Appelle getSpecificTeddy qui retourne un objet JSON
async function getTeddyById(teddyIDIndex = Number) {
    let teddiesList = await getTeddies();
    let teddiesIDsList = [];
    teddiesList.forEach((teddy) => {
        teddiesIDsList.push(teddy._id);
    });
    //console.log("IDs List: " + teddiesIDsList);
    let selectedTeddy = await getSpecificTeddy(teddiesIDsList[teddyIDIndex]);
    //console.log(selectedTeddy);
    return selectedTeddy;
};

//getTeddyById(0);

// Crée les cartes de produits de la page d'accueil à partir du template HTML
async function createProductCards() {
    const productCardTemplate = document.querySelector("#product");
    const productCards = document.querySelector("#products");
    let teddiesList = await getTeddies();
    teddiesList.forEach((product) => {
        let clone = document.importNode(productCardTemplate.content, true);
        clone.querySelector(".card-title").innerHTML = product.name;
        let price = product.price / 100;
        clone.querySelector(".card-text").innerHTML = price + "€";
        clone.querySelector(".card-img-top").setAttribute("src", product.imageUrl);
        clone.querySelector(".card-img-top").setAttribute("alt", "Peluche " + product.name);
        clone.querySelector(".card-link").setAttribute("href", productPageUrlFromIndex + "?id=" + product.name);
        productCards.appendChild(clone);
    });
};

createProductCards();

// Remplit le DOM de la page de fiche produit avec les infos récupérées dans l'API
const displayProductSheet = ($teddyName = Promise) => {
    const productSheet = document.querySelector("#productSheet");
    const pageTitle = document.querySelector("title");
    const titleGeneral = " | Orinoteddies par Orinoco";
    const colorSelect = document.querySelector("#teddyColor");
    const colorOptionTemplate = document.querySelector("#colorOption");
    $teddyName.then((product) => {
        console.log(product);
        pageTitle.innerHTML = product.name + titleGeneral;
        productSheet.querySelector(".product__pic__img").setAttribute("src", product.imageUrl);
        productSheet.querySelector(".product__pic__img").setAttribute("alt", "Peluche " + product.name);
        productSheet.querySelector(".product__txt__name").innerHTML = product.name;
        let price = product.price / 100;
        productSheet.querySelector(".product__txt__price").innerHTML = price + "€";
        productSheet.querySelector(".product__txt__description").innerHTML = product.description;
        let colorList = product.colors;
        console.log(colorList);
        colorList.forEach((color) => {
            let clone = document.importNode(colorOptionTemplate.content, true);
            clone.querySelector("option").setAttribute("value", color);
            clone.querySelector("option").innerHTML = color;
            colorSelect.appendChild(clone);
        });
    });
};

// Regarde l'URL de la page actuelle et si elle contient en id le nom d'une peluche, récupère l'objet correspondant depuis l'API puis appelle displayProductSheet pour cette peluche
async function createProductPage() {
    let currentPageUrl = window.location.href;
    let searchPageUrl = new URLSearchParams(currentPageUrl);
    for (let p of searchPageUrl) {
        let currentPageId = p[1];
        switch (currentPageId) {
            case "Norbert":
                console.log("Vous êtes sur la page de Norbert");
                let norbert = getTeddyById(0);
                displayProductSheet(norbert);
                break;
            case "Arnold":
                console.log("Vous êtes sur la page d'Arnold");
                let arnold = getTeddyById(1);
                displayProductSheet(arnold);
                break;    
            case "Lenny and Carl":
                console.log("Vous êtes sur la page de Lenny et Carl");
                let lenny = getTeddyById(2);
                displayProductSheet(lenny);
                break;
            case "Gustav":
                console.log("Vous êtes sur la page de Gustav");
                let gustav = getTeddyById(3);
                displayProductSheet(gustav);
                break;
            case "Garfunkel":
                console.log("Vous êtes sur la page de Garfunkel");
                let garfunkel = getTeddyById(4);
                displayProductSheet(garfunkel);
                break;
            default:
                console.log("Vous n'êtes pas sur une page produit");
        }
    }
}

createProductPage();