// Muestra los productos de LocalStorage
let articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

const miCarrito = new Carrito('€', articulosCarrito);

document.addEventListener('DOMContentLoaded', () => {

	// Variables
	const listaProducts = document.querySelector('#products');
	const contenedorCarrito = document.querySelector('#lista-carrito tbody');
	const contenedorTotales = document.querySelector('.tbody');
	const carritoCompra = document.querySelector('#modal');
	const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');

	// Listeners
	// Se agrega un producto al carrito presionando el botón "Comprar"
	listaProducts.addEventListener('click', agregarProductoCarrito);

	// Se elimina un producto del carrito
	carritoCompra.addEventListener('click', eliminarProducto);

	// Vaciar el carrito
	vaciarCarritoBtn.addEventListener('click', () => {
		// SweetAlert
		Swal.fire({
			title: '¿Está Usted Seguro?',
			text: "No podrá desacer el cambio!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, Vaciar el Carrito!',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					'Eliminados!',
					'Sus Productos han sido Borrados',
					'success'
				)
				// // reseteamos en memoria la cantidad para los productos del carrito
				// articulosCarrito.map(articuloCarrito => articuloCarrito.cantidad = 1);

				// // reseteamos el arreglo
				// articulosCarrito = [];

				// localStorage.removeItem('carrito');

				miCarrito.vaciarCarrito();

				// Eliminamos todo el HTML del tbody del carrito
				limpiarHTMLCarrito();

				// Actualizamos el total del carrito
				actualizarTotalesCarrito(articulosCarrito);

			}
		})

	});


	// Funciones
	// Actualiza totales del carrito
	function actualizarTotalesCarrito(articulosCarrito) {
		const totalCantidad = articulosCarrito.reduce((acc, item) => acc + item.amount, 0);
		const totalCompra = miCarrito.getTotalPrice();

		pintarTotalesCarrito(totalCantidad, totalCompra);
		sincronizarCarritoStorage();
	}

	// Muestra el total de la compra en el carrito
	function pintarTotalesCarrito(totalCantidad, totalCompra) {
		const contadorCarrito = document.getElementById("contador-carrito");
		const precioTotal = document.getElementById("precioTotal");

		contadorCarrito.textContent = totalCantidad;
		precioTotal.innerText = `${totalCompra}€`;
	};

	// Muestra los productos de LocalStorage
	articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
	pintarCarritoHTML();
	actualizarTotalesCarrito(articulosCarrito);

	function agregarProductoCarrito(e) {
		e.preventDefault();

		// Evitamos el event bubbling
		if (e.target.classList.contains('agregar-carrito')) {
			const idProductoSeleccionado = e.target.dataset.sku;

			fetch(`https://jsonblob.com/api/jsonBlob/1063884067560505344`)
				.then(res => res.json())
				.then(data => {
					// console.log(data);

					const { currency, products } = data;

					// Recuperamos el objeto del producto seleccionado
					// http://jsonblob.com/1063884067560505344
					const productoSeleccionado = products.find(product => product.SKU === idProductoSeleccionado);

					// Revisar si un producto ya existe en el carrito
					const existe = articulosCarrito.some(productoCarrito => productoSeleccionado.SKU === productoCarrito.SKU);

					// Actualizamos la cantidad
					miCarrito.actualizarUnidadesProducto(existe, productoSeleccionado);

					miCarrito.addProducto(productoSeleccionado);

					pintarCarritoHTML(currency);
					actualizarTotalesCarrito(articulosCarrito);
				});
		}
	}

	function pintarCarritoHTML(currency = '€') {
		limpiarHTMLCarrito();

		// Recorre el carrito y genera el HTML
		articulosCarrito.forEach(productoCarrito => {
			const { title, SKU, amount, price } = productoCarrito;

			let totalProducto = (price * amount).toFixed(2);

			const row = document.createElement('tr');
			row.classList.add('row');
			row.innerHTML = `
					<td>
						<p class="name">${title}</p>
						<p class="ref">Ref: ${SKU}</p>
					</td>
					<td>
						<span class="btn-menos">-</span>
						<span class="amount" data-SKU="${SKU}">${amount}</span>
						<span class="btn-mas">+</span>
					</td>
					<td>
						${price}${currency}
					</td>
					<td>
						${totalProducto}${currency}
					</td>
					<td>
						<a href="#" class="borrar-producto btn-carrito btn-carrito--red" data-SKU="${SKU}">Eliminar</a>
					</td>
				`;

			// Se agrega el HTML al carrito en el tbody
			contenedorCarrito.appendChild(row);

			const rowTotal = document.createElement('tr');
			rowTotal.classList.add('row-total');
			rowTotal.innerHTML = `
				<td>
					${title}
				</td>
				<td>
					${totalProducto}${currency}
				</td>
			`;

			// se agrega el HTML al carrito en el tfoot de la tabla Total
			contenedorTotales.appendChild(rowTotal);
		});

		modificarCantidadProducto();

		// Agregar el carrito de compras al LocalStorage
		sincronizarCarritoStorage();
	}

	function limpiarHTMLCarrito() {
		while (contenedorCarrito.firstChild) {
			contenedorCarrito.removeChild(contenedorCarrito.firstChild);
		}

		while (contenedorTotales.firstChild) {
			contenedorTotales.removeChild(contenedorTotales.firstChild);
		}
	}

	function sincronizarCarritoStorage() {
		localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
	}

	// Modifica la cantidad de Producto
	function modificarCantidadProducto() {
		const btnMas = document.querySelectorAll('.btn-mas');
		const btnMenos = document.querySelectorAll('.btn-menos');

		let contador;
		btnMas.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				contador = e.target.previousElementSibling.textContent;
				contador++;
				actualizarContador(e.target.previousElementSibling, contador);
				pintarCarritoHTML();
			});
		});

		btnMenos.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				contador = e.target.nextElementSibling.textContent;
				if (contador > 0) {
					contador--;
					actualizarContador(e.target.nextElementSibling, contador);
					pintarCarritoHTML();
				}
			});
		});
	}

	// Actualiza el contador de cantidad de producto
	const actualizarContador = (element, contador) => {
		element.textContent = contador;
		const id = element.dataset.sku;
		const existe = articulosCarrito.some(productoCarrito => id === productoCarrito.SKU);
		if (existe) {
			// Actualizamos la cantidad
			const productosCarrito = articulosCarrito.map(productoCarrito => {
				if (id === productoCarrito.SKU) {
					productoCarrito.amount = Number(element.textContent);
					return productoCarrito; // retorna el objeto actualizado
				} else {
					return productoCarrito; // retorna los objetos que no son duplicados
				}
			});
			articulosCarrito = [...productosCarrito];

			sincronizarCarritoStorage();

			actualizarTotalesCarrito(articulosCarrito);
		}
	}

	// Elimina un producto del carrito
	function eliminarProducto(e) {
		e.preventDefault();
		if (e.target.classList.contains('borrar-producto')) {
			const id = e.target.getAttribute('data-SKU');

			// SweetAlert
			Swal.fire({
				title: '¿Está Usted Seguro?',
				text: "No podrá desacer el cambio!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, Eliminarlo!',
				cancelButtonText: 'Cancelar'
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire(
						'Borrado!',
						'Su Producto ha sido Eliminado',
						'success'
					)

					miCarrito.eliminarProducto(id);

					// Actualizamos el total del carrito
					actualizarTotalesCarrito(articulosCarrito);

					pintarCarritoHTML(); // Iterar sobre el carrito y mostrar su HTML
				}
			})

		}
	}

});