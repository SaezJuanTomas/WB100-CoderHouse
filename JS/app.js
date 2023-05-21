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
} else if (currentPath.includes('listado')) {
  categoryName = 'listado';
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
    
    } else if (categoryName === 'listado') {
      categoryItems = data.filter(item => item.listado === "true");

    } 

    const categoryHtml = categoryItems.map((item, index) => `
    <div class="box" id="box-${index}" style="background-image: url(${item.poster})">
      ${item.nombre}
      <div class="overlay">
      <button onclick="changeListado(${index})">Agregar al listado</button>
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

    function changeListado(index) {
      // Cambiar el valor de "listado" a "true" en los datos locales
      data[index].listado = true;
    
      // Crear una solicitud PUT utilizando Ajax
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', 'url_del_servidor/data.json', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
    
      // Enviar los datos actualizados al servidor
      xhr.send(JSON.stringify(data));
    
      // Manejar la respuesta del servidor (opcional)
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // La solicitud se completó con éxito
          console.log('Los datos se han actualizado en el servidor.');
        } else {
          // Ocurrió un error durante la solicitud
          console.error('No se pudo actualizar los datos en el servidor.');
        }
      };
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
