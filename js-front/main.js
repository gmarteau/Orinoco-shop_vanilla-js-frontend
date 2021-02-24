const apiUrl = "http://localhost:3000/api/teddies";

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
    console.log(selectedTeddy);
    return selectedTeddy;
};

//getTeddyById(0);

// Crée les cartes de produits de la page d'accueil à partir du template HTML
async function createProductCards() {
    const productCardTemplate = document.querySelector("#product");
    const productCards = document.querySelector("#products");
    let teddiesList = await getTeddies();
    teddiesList.forEach(product => {
        let clone = document.importNode(productCardTemplate.content, true);
        clone.querySelector(".card-title").innerHTML = product.name;
        let price = product.price / 100;
        clone.querySelector(".card-text").innerHTML = price + "€";
        clone.querySelector(".card-img-top").setAttribute("src", product.imageUrl);
        clone.querySelector(".card-img-top").setAttribute("alt", "Peluche " + product.name);
        productCards.appendChild(clone);
    });
};

createProductCards();

