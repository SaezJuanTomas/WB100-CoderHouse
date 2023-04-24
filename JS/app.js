console.log("Esto funciona!")

// Obtener la categoría de la página actual
let categoryName = '';
const currentPath = window.location.pathname;
if (currentPath.includes('categoria-dc')) {
  categoryName = 'dc';
} else if (currentPath.includes('categoria-drama')) {
  categoryName = 'drama';
} else if (currentPath.includes('categoria-fantasia')) {
  categoryName = 'fantasia';
} else if (currentPath.includes('categoria-horror')) {
  categoryName = 'horror';
} else if (currentPath.includes('categoria-ciencia_ficcion')) {
  categoryName = 'ciencia_ficcion';
} else if (currentPath.includes('categoria-proxiamamente')) {
  categoryName = 'proximamente';
}

// Cargar el archivo JSON
fetch('json/data.json')
  .then(response => response.json())
  .then(data => {
    // Filtrar el JSON según la categoría de la página
    let categoryItems = [];
    if (categoryName === 'dc') {
      categoryItems = data.filter(item => item.genero === 'DCEU');
      data.forEach(item => {
        if (item.poster) {
          console.log(item.nombre + ': ' + item.poster);
          
          // aquí podrías mostrar la imagen en una página HTML usando <img src="{item.poster}" />
        }
      });
      

    } else if (categoryName === 'drama') {
      categoryItems = data.filter(item => item.genero === 'Drama');

    } else if (categoryName === 'fantasia') {
      categoryItems = data.filter(item => item.genero === 'Fantasia');

    } else if (categoryName === 'horror') {
      categoryItems = data.filter(item => item.genero === 'horror');

    } else if (categoryName === 'ciencia_ficcion') {
      categoryItems = data.filter(item => item.genero === 'Ciencia ficción');

    } else if (categoryName === 'proximamente') {
      const currentYear = new Date().getFullYear();
      categoryItems = data.filter(item => parseInt(item.año) >= currentYear);
    }

    const categoryHtml = categoryItems.map(item => `
    <div class="box" style="background-image: url(${item.poster})">
      ${item.nombre}
      <div class="overlay">
        <button class="button1">
          <i class="fa fa-shopping-cart"></i> Agregar al listado
        </button>
      </div>
    </div>
  `).join('');

    // Mostrar el HTML en una grid de 4 objetos por fila
    const container = document.querySelector('.grid-container');
    container.innerHTML = categoryHtml;
    const boxes = document.querySelectorAll('.box');
    for (let i = 0; i < boxes.length; i += 4) {
      const row = document.createElement('div');
      row.classList.add('grid-row');
      for (let j = 0; j < 4; j++) {
        const box = boxes[i + j];
        if (box) {
          row.appendChild(box);
        }
      }
      container.appendChild(row);
    }
  });

  const formulario = document.querySelector('form');
const contenedorResultados = document.querySelector('#peliculas-encontradas');

formulario.addEventListener('submit', function(evento) {
  evento.preventDefault();
  const criterioBusqueda = this.querySelector('input').value;
  fetch('json/data.json')
    .then(respuesta => respuesta.json())
    .then(data => {
      const peliculasEncontradas = data.filter(pelicula =>
        pelicula.nombre.toLowerCase().includes(criterioBusqueda.toLowerCase()) ||
        pelicula.director.toLowerCase().includes(criterioBusqueda.toLowerCase()) ||
        pelicula.año.toString().includes(criterioBusqueda)
      );
      console.log(peliculasEncontradas);

      const categoryHtml = peliculasEncontradas.map(item => `
      <div class="box" style="background-image: url(${item.poster})">${item.nombre}</div>
    `).join('');
    })
});
//CARRITO

// Cargar datos de películas desde data.json
fetch('json/data.json')
  .then(response => response.json())
  .then(data => {
    const categoryItems = data;

    // Crear array para almacenar películas seleccionadas
    const peliculasSeleccionadas = [];

    // Obtener elementos HTML necesarios
    const cartItemsEl = document.querySelector('#cart-items');

    // Función para actualizar el listado de compras en el navbar
    const actualizarListadoCompras = () => {
      // Vaciar el contenido actual del listado de compras
      cartItemsEl.innerHTML = '';

      // Crear un nuevo elemento HTML para cada película seleccionada
      peliculasSeleccionadas.forEach(pelicula => {
        const peliculaEl = document.createElement('div');
        peliculaEl.innerHTML = `<strong>${pelicula.nombre}</strong> (${pelicula.año}) <em>${pelicula.director}</em>`;
        cartItemsEl.appendChild(peliculaEl);
      });
    };

    // Agregar evento "click" al botón "Agregar al listado" en cada caja de película
    const boxEls = document.querySelectorAll('.box');
    boxEls.forEach((boxEl, index) => {
      const buttonEl = boxEl.querySelector('.button1');
      buttonEl.addEventListener('click', () => {
        // Obtener la película correspondiente al índice de la caja de película
        const peliculaSeleccionada = categoryItems[index];

        // Agregar la película al array de películas seleccionadas
        peliculasSeleccionadas.push(peliculaSeleccionada);

        // Actualizar el listado de compras en el navbar
        actualizarListadoCompras();
      });
    });
  });
