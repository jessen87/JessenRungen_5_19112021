// Obtenir id depuis localStorage key(i)
async function getInfoWithId(i) {
	let idColorStr = localStorage.key(i);
	let idColorArray = idColorStr.split(",");
	let itemId = idColorArray[0];
	try {
		let response = await fetch(`http://localhost:3000/api/products/${itemId}`);
		return await response.json();
	} catch (error) {
		console.log("Error : " + error);
	}
}

// Verification panier vide
function checkIfCartEmpty() {
	if (localStorage.length == 0) {
		document.getElementById("cart__items").innerHTML = "<p >Il n'y a pas encore de Kanap ici, visitez <a href='./index.html' style=' color:white; font-weight:700'>notre séléction 🛋️</a>.</p>";
	}
}

// Pousser chaque element sur le HTML, puis activer la fonction qui correspond
	let htmlRender = "";
	const itemContainer = document.getElementById("cart__items");
	// Premier controle si le panier est vide
	checkIfCartEmpty();
	// Sinon commencer la boucle
	for (let i = 0; i < localStorage.length; i++) {
		let item = await getInfoWithId(i);
		let htmlContent = `
		<article class="cart__item" data-id="${item._id}" data-color="${localStorage.key(i).split(",")[1]}" data-price="${item.price}">
			<div class="cart__item__img">
				<img src="${item.imageUrl}" alt="${item.altTxt}">
			</div>
			<div class="cart__item__content">
				<div class="cart__item__content__titlePrice">
					<h2>${item.name}</h2>
					<p>${item.price} €</p>
					<p>Coloris : ${localStorage.key(i).split(",")[1]}</p>
				</div>
				<div class="cart__item__content__settings">
					<div class="cart__item__content__settings__quantity">
						<p>Qté : </p>
						<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStorage.getItem(localStorage.key(i))}">
					</div>
					<div class="cart__item__content__settings__delete">
						<p class="deleteItem">Supprimer</p>
					</div>
				</div>
			</div>
		</article>
		`;
		htmlRender += htmlContent;
	}
	itemContainer.innerHTML += htmlRender;

	// Activer la suppression de la fonction
	deleteItem();
	// Activer la modification de la quantité
	itemQuantityRefresh();
	// initialiser le montant total de l'articlee
	totalItemInCartRefresh();
	// initialiser le prix total du panier
	totalPriceRefresh();
})();


// actualiser le prix total du panier
function totalPriceRefresh() {
	let quantitySelector = document.querySelectorAll(".itemQuantity");
	let totalCartPrice = 0;
	for (let i = 0; i < quantitySelector.length; i++) {
		let articleDOM = quantitySelector[i].closest("article");
		let individualPrice = articleDOM.dataset.price;
		totalCartPrice += parseInt(quantitySelector[i].value) * individualPrice;
	}
	let totalPriceDisplay = document.getElementById("totalPrice");
	totalPriceDisplay.innerHTML = totalCartPrice;
}

// actualiser la quantité totale d'article dans le panier
function totalItemInCartRefresh() {
	let quantitySelector = document.querySelectorAll(".itemQuantity");
	let itemAmount = 0;
	for (let i = 0; i < quantitySelector.length; i++) {
		itemAmount += parseInt(quantitySelector[i].value);
	}
	const totalQuantityDisplay = document.getElementById("totalQuantity");
	totalQuantityDisplay.innerHTML = itemAmount;

	// Appeler la nouvelle fonction de prix total lors du changement
	totalPriceRefresh();
	// Vérifiez s'il n'y a pas d'article
	checkIfCartEmpty();
}

// Suppression du travail d'élément sur le DOM et localStorage
function deleteItem() {
	let deleteItemBtns = document.querySelectorAll(".deleteItem");
	for (let i = 0; i < deleteItemBtns.length; i++) {
		deleteItemBtns[i].addEventListener("click", (e) => {
			e.preventDefault();

			let articleDOM = deleteItemBtns[i].closest("article");
			let itemId = articleDOM.dataset.id;
			let itemColor = articleDOM.dataset.color;
			let itemQuantity = localStorage.getItem(localStorage.key(i));
			let localStorageKey = [itemId, itemColor];
			// Suppression dans localStorage et dans le DOM
			localStorage.removeItem(localStorageKey, itemQuantity);
			articleDOM.remove();

			// Actualisation du montant total de l'article dans le panier
			totalItemInCartRefresh();
		});
	}
}

// Modification de la quantité d'articles au total et localStorage
function itemQuantityRefresh() {
	let quantitySelector = document.querySelectorAll(".itemQuantity");
	for (let i = 0; i < quantitySelector.length; i++) {
		quantitySelector[i].addEventListener("change", (e) => {
			e.preventDefault();

			let articleDOM = quantitySelector[i].closest("article");
			let itemId = articleDOM.dataset.id;
			let itemColor = articleDOM.dataset.color;
			let localStorageKey = [itemId, itemColor];
			let itemQuantity = e.target.value;
			if (itemQuantity == 0) {
				alert("Il faut au moins ajouter un Kanap 🛋️");
			}
			localStorage.setItem(localStorageKey, itemQuantity);

			// Actualisation du montant total de l'article
			totalItemInCartRefresh();
		});
	}
}


// Objet pour la saisie de l'utilisateur
class Form {
	constructor() {
		this.firstName = document.getElementById("firstName").value;
		this.lastName = document.getElementById("lastName").value;
		this.adress = document.getElementById("address").value;
		this.city = document.getElementById("city").value;
		this.email = document.getElementById("email").value;
	}
}

// Analyser l'entrée de l'utilisateur avec regex
function userInputVerification() {
	const userForm = new Form();
	// Le prénom
	function firstNameValid() {
		const userFirstName = userForm.firstName;
		const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
		if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(userFirstName)) {
			firstNameErrorMsg.innerText = "";
			return true;
		} else {
			firstNameErrorMsg.innerText = "Votre prénom ne peut contenir que des lettres, de 3 à 20 caractères.";
		}
	}
	// Le nom de famille
	function lastNameValid() {
		const userLastName = userForm.lastName;
		const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
		if (/^[A-Za-z]{2,20}$/.test(userLastName)) {
			lastNameErrorMsg.innerText = "";
			return true;
		} else {
			lastNameErrorMsg.innerText = "Votre nom ne peut contenir que des lettres, de 2 à 20 caractères.";
		}
	}
	// L'adresse
	function adressValid() {
		const userAdress = userForm.adress;
		const addressErrorMsg = document.getElementById("addressErrorMsg");
		if (/[^§]{5,50}$/.test(userAdress)) {
			addressErrorMsg.innerText = "";
			return true;
		} else {
			addressErrorMsg.innerText = "L'adresse semble incorrect.";
		}
	}
	// La ville
	function cityValid() {
		const userCity = userForm.city;
		const cityErrorMsg = document.getElementById("cityErrorMsg");
		if (/^[A-Za-z]{2,20}$/.test(userCity)) {
			cityErrorMsg.innerText = "";
			return true;
		} else {
			cityErrorMsg.innerText = "La ville ne peut contenir que des lettres, de 2 à 20 caractères.";
		}
	}
	// L'email
	function emailValid() {
		const userEmail = userForm.email;
		const emailErrorMsg = document.getElementById("emailErrorMsg");
		if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userEmail)) {
			emailErrorMsg.innerText = "";
			return true;
		} else {
			emailErrorMsg.innerText = "Il faut renseigner une adresse email valide.";
		}
	}

	if (firstNameValid() && lastNameValid() && adressValid() && cityValid() && emailValid()) {
		return true;
	} else {
		console.log("Unvalid form input.");
	}
}

// Pousser l'identifiant des produits du panier dans un tableau
function productToSend() {
	let userBasket = [];
	for (let i = 0; i < localStorage.length; i++) {
		let idColor = localStorage.key(i);
		let idColorArray = idColor.split(",");
		let id = idColorArray[0];
		userBasket.push(id);
	}
	return userBasket;
}

// Envoyez les informations au serveur si elles sont valides, demandez orderId
let userFormSubmit = document.getElementById("order");
userFormSubmit.addEventListener("click", (e) => {
	e.preventDefault();

	if (userInputVerification()) {
		const products = productToSend();
		const toSend = {
			contact: {
				firstName: firstName.value,
				lastName: lastName.value,
				address: address.value,
				city: city.value,
				email: email.value,
			},
			products,
		};
		// Publication sur l'API
		fetch("http://localhost:3000/api/products/order", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(toSend),
		})
			// Storing order Id in the url
			.then((response) => response.json())
			.then((value) => {
				localStorage.clear();
				document.location.href = `./confirmation.html?id=${value.orderId}`;
			})
			.catch((error) => {
				console.log("Error: " + error);
			});
	}
});
