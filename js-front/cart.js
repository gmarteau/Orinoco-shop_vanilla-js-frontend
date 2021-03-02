const apiUrl = "http://localhost:3000/api/teddies";
const sendOrderButton = document.querySelector("#placeOrder");


// Récupère les données saisies par l'utilisateur dans les champs du formulaire, puis les regroupe dans un objet "contact" qui est retourné
const createContact = () => {
    let firstName = document.querySelector("#firstName").value;
    let lastName = document.querySelector("#lastName").value;
    let address = document.querySelector("#address").value;
    let city = document.querySelector("#city").value;
    let email = document.querySelector("#email").value;
    let contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
    };
    return contact;
}

// Envoie les infos relatives à la commande au serveur
const sendOrder = (event) => {
    event.preventDefault();
    let contact = createContact();
    console.log(contact);
    let request = new XMLHttpRequest();
    request.open("POST", apiUrl + "/order");
    request.send(JSON.stringify(contact));
}

// Appelle sendOrder lorsque l'utilisateur clique sur "Commander"
sendOrderButton.addEventListener("click", sendOrder);