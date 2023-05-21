console.log("Esto funciona")

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
} else if (currentPath.includes('categoria-proximamente')) {
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

    const categoryHtml = categoryItems.map((item, index) => `
    <div class="box" id="box-${index}" style="background-image: url(${item.poster})">
      ${item.nombre}
      <div class="overlay">
        <button class="btn btn-light">
          Agregar al listado
        </button>
      </div>
    </div>
  `).join('');

    // Mostrar el HTML en una grid de 4 objetos por fila
    const container = document.querySelector('.grid-container');
    container.innerHTML = categoryHtml;
    const boxes = document.querySelectorAll('.box');
    for (let i = 0; i < boxes.length; i += 3) {
      const row = document.createElement('div');
      row.classList.add('grid-row');
      for (let j = 0; j < 3; j++) {
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


//SEARCH
$('form').submit(function(event) {
  event.preventDefault(); // detener el comportamiento predeterminado del formulario
  const searchTerm = $('input[name="searchTerm"]').val(); // obtener el término de búsqueda
  window.location.href = `search.html?searchTerm=${searchTerm}`; // redirigir a la página de resultados
});

$(document).ready(function() {
  // Obtén el término de búsqueda de la URL
  const searchParams = new URLSearchParams(window.location.search);
  const searchTerm = searchParams.get('searchTerm');

  if (searchTerm !== null) { // Verifica si searchTerm no es nulo
    // Usa Ajax para obtener los datos del archivo JSON
    $.ajax({
      url: '/json/data.json',
      dataType: 'json',
      success: function(data) {
        // Filtra los resultados para encontrar películas que coincidan con el término de búsqueda
        const results = data.filter(function(movie) {
          return movie.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.año.toString().includes(searchTerm);
        });

        // Crea los elementos HTML para los resultados
        const categoryHtml = results.map((item, index) => `
          <div class="box" id="box-${index}" style="background-image: url(${item.poster})">
            ${item.nombre}
            <div class="overlay">
              <button class="btn btn-light">
                Agregar al listado
              </button>
            </div>
          </div>
        `).join('');

        // Agrega los elementos HTML al contenedor de resultados
        $('#results').html(`<div class="row">${categoryHtml}</div>`);
      },
      error: function() {
        alert('Error al cargar los datos.');
      }
    });
  }
});

//LISTADO
$.ajax({
  url: 'json/data.json', // Ajusta la URL según la ubicación de tu archivo JSON
  dataType: 'json',
  success: function(data) {
    // Aquí puedes acceder a los datos de las películas en la variable 'data'
    categoryItems = data; // Asigna los datos a la variable 'categoryItems'
  },
  error: function() {
    alert('Error al cargar los datos de las películas.');
  }
});


$(document).ready(function() {
  // Crear una lista para almacenar las películas agregadas
  var peliculasAgregadas = [];

  // Agrega el evento click a los botones "Agregar al listado"
  $(document).on('click', '.btn.btn-light', function() {
    // Obtener el índice del elemento clickeado
    var index = $(this).closest('.box').attr('id').split('-')[1];
    
    // Obtener los datos de la película seleccionada
    var pelicula = categoryItems[index];
    
    // Agregar la película a la lista de películas agregadas
    peliculasAgregadas.push(pelicula);

    // Actualizar el contenido de los contenedores de películas
    actualizarContenedorPeliculas();

    // Realizar la llamada AJAX para guardar los datos
    $.ajax({
      url: 'guardar_datos.php', // Cambia 'guardar_datos.php' por la URL correcta para guardar los datos en tu servidor
      type: 'POST',
      data: pelicula,
      success: function(response) {
        // Comprobar si la respuesta es exitosa
        if (response === 'success') {
          alert('Película agregada al listado.');
        } else {
          alert('Error al guardar los datos.');
        }
      },
      error: function() {
        alert('Error en la llamada AJAX.');
      }
    });
  });

  // Función para actualizar el contenido de los contenedores de películas
  function actualizarContenedorPeliculas() {
    var contenedorPeliculas = $('#peliculas-agregadas');
    var contenedorNoPeliculas = $('#no-peliculas-agregadas');

    // Verificar si hay películas agregadas
    if (peliculasAgregadas.length > 0) {
      // Limpiar el contenido del contenedor de películas
      contenedorPeliculas.empty();

      // Generar los elementos HTML para las películas agregadas
      var peliculasHtml = peliculasAgregadas.map(function(pelicula, index) {
        return `
          <div class="box" id="box-${index}" style="background-image: url(${pelicula.poster})">
            ${pelicula.nombre}
            <div class="overlay">
              <button class="btn btn-light">
                Agregar al listado
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Agregar los elementos HTML al contenedor de películas
      contenedorPeliculas.html(`<div class="row">${peliculasHtml}</div>`);

      // Ocultar el contenedor de "no hay películas agregadas" si está visible
      contenedorNoPeliculas.hide();
    } else {
      // No hay películas agregadas, mostrar el mensaje correspondiente
      contenedorNoPeliculas.show();

      // Limpiar el contenido del contenedor de películas
      contenedorPeliculas.empty();
    }
  }
});
