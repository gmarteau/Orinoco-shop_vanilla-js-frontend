const getTeddy = (listNumber = Number) => {
    let requestAll = new XMLHttpRequest();
    requestAll.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            let response = JSON.parse(this.responseText);
            let teddy = response[listNumber];
            console.log(teddy);
            return teddy;
        }
    };
    requestAll.open("GET", "http://localhost:3000/api/teddies");
    requestAll.send();
}

getTeddy(0);

const firstTeddy = getTeddy(0);
console.log(firstTeddy);