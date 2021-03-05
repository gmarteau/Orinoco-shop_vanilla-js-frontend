const confirmPageName = document.querySelector("#firstName");
const confirmPagePrice = document.querySelector("#totalPrice");
const confirmPageOrderId = document.querySelector("#orderId");

console.log(localStorage);

// Récupère dans le localStorage le prix total pour chaque item et les additionne pour obtenir le prix total de la commande
const calculateTotalPrice = () => {
    let productsListString = localStorage.getItem("productsInCart");
    let productsList = JSON.parse(productsListString);
    let pricesToAdd = [];
    productsList.forEach((product) => {
        productObject = JSON.parse(product);
        pricesToAdd.push(productObject.totalPrice);
    });
    let totalPrice = pricesToAdd.reduce((a, b)=> a + b,0);
    console.log(totalPrice);
    return totalPrice;
};

// Remplit le contenu manquant du fichier HTML à partir des infos contenues dans le localStorage et qui ont été ajoutés lors de la validation de la commande
const buildConfirmationMessage = () => {
    let lastOrderContactString = localStorage.getItem("lastOrderContact");
    let lastOrderContact = JSON.parse(lastOrderContactString);
    let lastOrderIdString = localStorage.getItem("lastOrderId");
    let lastOrderId = JSON.parse(lastOrderIdString);
    console.log(lastOrderContact);
    console.log(lastOrderId);
    let lastOrderTotalPrice = calculateTotalPrice();
    confirmPageName.textContent = lastOrderContact.firstName;
    confirmPagePrice.textContent = lastOrderTotalPrice + "€";
    confirmPageOrderId.textContent = lastOrderId;
};

// Récupère la liste des items dans le panier depuis le localStorage, puis en regarde la longueur
// Si le panier est vide, n'affiche pas l'icone, sinon l'affiche en lui indiquant le nombre d'éléments dans la liste, qui correspond au nombre d'articles dans le panier
const displayCartSizeIconInNav = () => {
    const cartSizeIconInNav = document.querySelector("#cartSizeIconInNav");
    let productsInCart = localStorage.getItem("productsInCart");
    let productsInCartList = [];
    if (productsInCart !== null) {
        productsInCartList = JSON.parse(productsInCart);
    }
    if (productsInCartList.length == 0) {
        cartSizeIconInNav.hidden = true;
    }
    else {
        cartSizeIconInNav.textContent = productsInCartList.length;
        cartSizeIconInNav.hidden = false;
    }
};


buildConfirmationMessage();
setTimeout(function() {
    localStorage.clear();
    setTimeout(displayCartSizeIconInNav, 100);
}, 100);