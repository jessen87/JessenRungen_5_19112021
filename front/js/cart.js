//----------------- Récupération du panier -----------------------//

// Déclaration des items contenus dans le local storage
let cartItem = JSON.parse(localStorage.getItem("cart"));
console.log(cartItem);

// Sélection de la classe où injecter les éléments
const positionItems = document.querySelector("#cart__items");


// Si le panier est vide : afficher le panier vide
if (cartItem === null || cartItem == 0) {
  const emptyCart = document.querySelector("#cart__items");
  emptyCart.innerText = "Votre panier est actuellement vide.";
  console.log(emptyCart);
  // Cacher le formulaire de saisie infos utilisateur
  document.querySelector(".cart__order").style.display = "none";

  // Si le panier n'est pas vide, affichage des items
} else {
  for (i = 0; i < cartItem.length; i++) {
    let items = cartItem[i];
    // Appel à API et récupération de l'élément d'index cible dans la boucle
    fetch("http://localhost:3000/api/products/" + cartItem[i].productId)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(items);
        positionItems.appendChild(displayItem(data, items.color, items.quantity));
        displayTotalPrice(data.price * items.quantity);
        changeQuantity();
        deleteProduct();
      })
  }
};


//--------- Evènements sur les éléments du panier -----------------//

/**
 * Calcul du prix total du panier
 * @param { number } price
 * Affiche le résultat de la conversion en nombre  
 */
function displayTotalPrice(price) {
  let divTotalPrice = document.querySelector("#totalPrice");
  //console.log(parseFloat(divTotalPrice.textContent));
  divTotalPrice.textContent = parseFloat(divTotalPrice.textContent) + price;
};


// Calcul du nombre d'articles dans le panier
let arrayQuantities = [];
if (cartItem === null || cartItem == 0) {
  console.log("Panier vide");
} else {
  for (let items of cartItem) {
    let ItemQuantity = + items.quantity;
    arrayQuantities.push(ItemQuantity);
  }
  console.log(arrayQuantities);
  // Méthode d'application de fonction d'accumulateur
  const reducer = (previousValue, currentValue) => previousValue + currentValue;
  let totalQuantityCart = arrayQuantities.reduce(reducer);
  document.querySelector("#totalQuantity").innerHTML = totalQuantityCart;
}


// Suppression d'un article du panier

function deleteProduct() {
  // Sélection des boutons de suppression à écouter
  let deleteBtn = document.querySelectorAll(".deleteItem");

  for (let k = 0; k < deleteBtn.length; k++) {
    deleteBtn[k].addEventListener("click", (event) => {
      event.preventDefault();
      // Méthode pour cibler l'id et couleur du produit 
      let selectProd = deleteBtn[k].closest("article");
      let selectIdItem = selectProd.dataset.id;
      console.log(selectIdItem);
      let selectColorItem = selectProd.dataset.color;
      console.log(selectColorItem);
      // Méthode renvoie nouveau tableau contenant les éléments qui respectent la condition du filtre
      cartItem = cartItem.filter(el => el.productId !== selectIdItem || el.color !== selectColorItem);
      console.log(cartItem);
      // Renvoi du nouveau panier dans le local storage
      localStorage.setItem("cart", JSON.stringify(cartItem));

      location.reload();
    })
  }
}


// Modification de la quantité d'un article

function changeQuantity() {
  // Sélection des inputs à écouter
  let itemQuantity = document.querySelectorAll(".itemQuantity");
  // Méthode pour cibler id et couleur du produit
  itemQuantity.forEach((itemQty) => {
    let articleQty = itemQty.closest("article");
    let articleQtyId = articleQty.dataset.id;
    console.log(articleQtyId);
    let articleQtyColor = articleQty.dataset.color;
    console.log(articleQtyColor);
    // Evènement de modification pour écouter changement de quantité
    itemQty.addEventListener("change", () => {
      let newQantity = Number(itemQty.value);
      /* Fonction callback pour chaque élément du panier
      --- au change on incrémente la quantité de l'élément de ces id&&couleur */
      cartItem.forEach((element) => {
        if (element.productId == articleQtyId && element.color == articleQtyColor) {
          element.quantity = newQantity;
        }
      });
      // Renvoi du nouveau panier dans le local storage
      localStorage.setItem("cart", JSON.stringify(cartItem));
      window.location.reload();
    });
  });
}


//----------------- Formulaire de commande -------------------------------//

// Sélection bouton envoi du formulaire
const orderButton = document.querySelector("#order");

// Add event listener
orderButton.addEventListener("click", (e) => {
  e.preventDefault();


  /* Création d'une classe pour fabriquer l'objet 
  dans lequel iront les valeurs du formulaire à contrôler */
  class Formulaire {
    constructor() {
      this.prenom = document.querySelector("#firstName").value;
      this.nom = document.querySelector("#lastName").value;
      this.adresse = document.querySelector("#address").value;
      this.ville = document.querySelector("#city").value;
      this.email = document.querySelector("#email").value;
    }
  }
  // Appel de l'instance de classe formulaire pour créer l'objet contact
  const contact = new Formulaire();


  // Construction d'un array of strings depuis local storage
  let idProducts = [];
  for (let i = 0; i < cartItem.length; i++) {
    idProducts.push(cartItem[i].productId);
  }
  console.log(idProducts);


  //-------- Gestion de validation du formulaire 

  // Fonction de contrôle des saisies selon regEx

  // Masque de recherche pour prenom/nom/ville
  const regExNameCity = (value) => {
    return /^[A-Za-zÀ-ÿ ,.'-]{3,20}$/.test(value)
  }
  // Motif de recherche pour l'adresse
  const regExAddress = (value) => {
    return /^([a-zA-ZÀ-ÿ,-. ]{1,}|[0-9]{1,4})[ ].{1,}$/.test(value)
  }
  // Masque de recherche de l'email
  const regExEmail = (value) => {
    return /^[a-zA-Z0-9.-_]+@{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(value)
  }


  //-------- Fonctions de saisie des champs du formulaire
  function firstNameCheck() {
    const lePrenom = contact.prenom;
    if (regExNameCity(lePrenom)) {
      firstNameErrorMsg.innerHTML = " ";
      return true;
    } else {
      firstNameErrorMsg.innerHTML = "Veuillez saisir uniquement des lettres avec/sans accent, minimum de 3";
      return false;
    };
  }

  function lastNameCheck() {
    const leNom = contact.nom;
    if (regExNameCity(leNom)) {
      lastNameErrorMsg.innerHTML = " ";
      return true;
    } else {
      lastNameErrorMsg.innerHTML = "Veuillez saisir uniquement des lettres avec/sans accent, minimum de 3";
      return false;
    };
  }

  function addressCheck() {
    const leAddress = contact.adresse;
    if (regExAddress(leAddress)) {
      addressErrorMsg.innerHTML = " ";
      return true;
    } else {
      addressErrorMsg.innerHTML = "Veuillez renseigner une adresse valide";
      return false;
    };
  }

  function cityCheck() {
    const laVille = contact.ville;
    if (regExNameCity(laVille)) {
      cityErrorMsg.innerHTML = " ";
      return true;
    } else {
      cityErrorMsg.innerHTML = "Veuillez renseigner une ville";
      return false;
    };
  }

  function eMailCheck() {
    const leMail = contact.email;
    if (regExEmail(leMail)) {
      console.log("ok");
      emailErrorMsg.innerHTML = " ";
      return true;

    } else {
      console.log("ko");
      emailErrorMsg.innerHTML = "Adresse email non valide";
      return false;
    };
  }


  // Contrôle validité du formulaire avant envoi dans local storage
  if (firstNameCheck() && lastNameCheck() && addressCheck() && cityCheck() && eMailCheck()) {
    // Mettre l'objet dans le local storage
    //localStorage.setItem("contact", JSON.stringify(contact));
    // Mettre les valeurs du formulaire et les produits du panier dans un objet à envoyer vers le serveur
    const order = {
      contact: {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value,
      },
      products: idProducts,
    }
    console.log("Envoyer", order);

    sendToServer(order);
  } else {
    return false;
  };
});


/* Fonction d'envoi de la commande avec la méthode POST
requête JSON contenant l'objet de contact et tableau de produit (order) */
function sendToServer(order) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      'Accept': "application/json",
      "Content-type": "application/json",
    },
  })
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    // Récupération de la réponse émise
    .then(function (content) {
      console.log("CONTENT", content);
      // Redirection vers la page de confirmation + id de commande en paramètre URL
      window.location = "confirmation.html?id=" + content.orderId;
    })
    .catch(function (error) {
      alert(`Erreur de ${error}`);
    });
}

