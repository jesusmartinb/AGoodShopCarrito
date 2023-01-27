document.addEventListener('DOMContentLoaded', () => {

	// Contenedor para mostrar los productos
	const listaProductos = document.querySelector('#lista-productos');

	const accesorios = document.querySelector('#accesorios');

	// Funciones
	function data() {

		fetch(`https://jsonblob.com/api/jsonBlob/1063884067560505344`)
			.then(res => res.json())
			.then(data => {
				// console.log(data);

				const { currency, products } = data;

				// console.log(products);

				// Mostramos los productos al cargar la página
				mostrarProductos(products, currency);
			});
	}

	data();

	function mostrarProductos(products, currencySymbol) {

		const list = document.createElement('ul');
		list.classList.add('cards');

		products.forEach(product => {
			const { type, SKU, title, description, offer, newproduct, price } = product;

			if (type === 'Producto Principal') {
				const productoOferta = document.createElement('section');

				productoOferta.classList.add('oferta');

				productoOferta.innerHTML = `
						<div class="oferta__image image">
							<img class="image__img" src="https://via.placeholder.com/470" alt="iFhone 13 Pro">
							<div class="image__pill">
								128gb
							</div>
						</div> 
						<div class="oferta__contenido">
							<p class="oferta__oferta"><strong>oferta</strong></p>
							<h2 class="oferta__title title">${title}</h2>
							<p class="oferta__description">
								${description}
							</p>
							<div class="oferta__comprar comprar">
								<p class="comprar__precio">
									${price}${currencySymbol}
								</p>
								<button class="agregar-carrito comprar__btn btn btn--comprar" data-SKU="${SKU}">Comprar</button>
							</div>
							<div class="oferta__facil">
								<div class="oferta__icon">
									<i class="fa-solid fa-truck-fast"></i>
									Envío rápido, gratuito y sin contacto
								</div>
								<div class="oferta__icon">
									<i class="fa-solid fa-rotate-right"></i> Devoluciones fáciles y gratuitas
								</div>
								<div class="oferta__icon">
									<i class="fa-solid fa-file-invoice-dollar"></i> Posibilidad de pago a plazos
								</div>
							</div> 
						</div>
					`;

				// Se inserta el producto principal en el HTML
				listaProductos.appendChild(productoOferta);


			} else if (type === 'Accesorio') {
				const cardHTML = document.createElement('li');

				cardHTML.classList.add('card-accesorio');

				cardHTML.innerHTML = `
						<article>
							<header class="card-accesorio__header">
								<img class="card-accesorio__img image__img" src="https://via.placeholder.com/350x169" alt="Cargador para el iFhone 13 Pro">
								<h3 class="card-accesorio__title">${title}</h3>
							</header>
							<div class="card-accesorio__body">
								${offer ? '<span class="card-accesorio__pill btn btn--oferta">Oferta</span>' : ''}
								${newproduct ? '<span class="card-accesorio__pill btn btn--nuevo">Nuevo</span>' : ''}
								<p class="card-accesorio__description">${description}</p>
							</div>
							<div class="oferta__comprar comprar">
								<p class="comprar__precio">
									${price}${currencySymbol}
								</p>
								<button class="agregar-carrito comprar__btn btn btn--comprar" data-SKU="${SKU}">Comprar</button>
							</div> 
						</article>
					`;

				// Se insertan los card en el listado
				list.appendChild(cardHTML);
				// Se inserta el listado de accesorios en el HTML
				accesorios.appendChild(list);
			}

		});

	}

});