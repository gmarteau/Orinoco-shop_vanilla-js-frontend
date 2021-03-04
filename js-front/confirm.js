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

buildConfirmationMessage();