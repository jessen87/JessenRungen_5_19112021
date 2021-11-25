// Vérifiez le paramètre Id dans l'URL
function idVerification() {
	let url = new URL(window.location.href);
	let searchParams = new URLSearchParams(url.search);
	if (searchParams.has("id")) {
		let id = searchParams.get("id");
		return id;
	} else {
		console.log("Error, no Id found in the URL");
	}
}

// Obtenez uniquement les informations pour le produit spécifié
async function getInfoById() {
	let id = idVerification();
	try {
		let response = await fetch(`http://localhost:3000/api/products/${id}`);
		return await response.json();
	} catch (error) {
		console.log("Error : " + error);
	}
}

// Gérer le rendu sur le HTML
(async function renderItem() {
	let item = await getInfoById();
	document.querySelector(".item__img").innerHTML += `<img src="${item.imageUrl}" alt="${item.altTxt}">`;
	document.getElementById("title").innerHTML += item.name;
	document.getElementById("price").innerHTML += item.price;
	document.getElementById("description").innerHTML += item.description;
	// Choice of item colors
	item.colors.forEach((color) => {
		let htmlContent = `<option value="${color}">${color}</option>`;
		document.getElementById("colors").innerHTML += htmlContent;
	});
})();

// Ajouter au panier et localStorage
const addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", () => {
	const itemId = idVerification();
	const itemColor = document.getElementById("colors").value;
	const itemQuantity = document.getElementById("quantity").value;
	// Confirmer la couleur et la quantité != 0
	if (itemColor === "") {
		alert("Il est nécessaire de choisir une couleur 🌈");
	} else if (itemQuantity == 0) {
		alert("Il faut au moins ajouter un Kanap 🛋️");
	} else {
		// Pousser dans le localStorage
		const itemInCart = [itemId, itemColor];
		localStorage.setItem(itemInCart, itemQuantity);
		window.location.href = "./cart.html";
	}
});
