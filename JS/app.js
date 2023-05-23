console.log("Esto funciona")

function changeListado(id, data) {
  // Verificar si la película ya está en la lista
  const movieExists = data.some(item => item.id === id && item.listado === true);

  if (movieExists) {
    Toastify({
      text: "¡Ya está en tu lista!",
      duration: 1500,
      gravity: "top",
      className: "toastify",
    }).showToast();
    return; // Salir de la función si la película ya está en la lista
  }

  // Encontrar el índice del elemento en el arreglo usando el "id" correspondiente
  const index = data.findIndex(item => item.id === id);

  if (index !== -1) {
    // Cambiar el valor de "listado" a "true" en los datos locales
    data[index].listado = true;

    // Obtener los datos de la película
    const pelicula = data[index];

    // Obtener los datos almacenados en el almacenamiento local
    const storedData = JSON.parse(localStorage.getItem('peliculas')) || [];

    if (storedData.length > index) {
      storedData[index].listado = true;
    } else {
      console.log('No se encontró ninguna película con el ID proporcionado en el almacenamiento local.');
    }

    // Guardar los datos modificados en el almacenamiento local
    localStorage.setItem('peliculas', JSON.stringify(storedData));

    // Mostrar los datos de la película en la consola
    console.log('Los datos se han actualizado localmente.');
    console.log('Datos de la película:', pelicula);

    Toastify({
      text: "¡Agregado a tu listado!",
      duration: 1500,
      gravity: "top",
      className: "toastify",
    }).showToast();
  } else {
    console.log('No se encontró ninguna película con el ID proporcionado.');
  }
}

function eliminarListado(id, data) {
  // Verificar si la película está en la lista y tiene el valor "listado" establecido en "true"
  const movieIndex = data.findIndex(item => item.id === id && item.listado === true);

  if (movieIndex === -1) {
    Toastify({
      text: "¡Ya se eliminó de tu lista!",
      duration: 1500,
      gravity: "top",
      className: "toastify",
    }).showToast();
    return; // Salir de la función si la película ya está eliminada de la lista
  }

  // Obtener los datos de la película
  const pelicula = data[movieIndex];

  // Cambiar el valor de "listado" a "false" solo en el elemento correspondiente
  data[movieIndex].listado = false;

  // Obtener los datos almacenados en el almacenamiento local
  const storedData = JSON.parse(localStorage.getItem('peliculas')) || [];

  // Encontrar el índice del elemento en el almacenamiento local usando el "id" correspondiente
  const storedMovieIndex = storedData.findIndex(item => item.id === id);

  if (storedMovieIndex !== -1) {
    // Cambiar el valor de "listado" a "false" solo en el elemento correspondiente
    storedData[storedMovieIndex].listado = false;
  } else {
    console.log('No se encontró ninguna película con el ID proporcionado en el almacenamiento local.');
  }

  // Guardar los datos modificados en el almacenamiento local
  localStorage.setItem('peliculas', JSON.stringify(storedData));

  // Mostrar los datos de la película en la consola
  console.log('Los datos se han actualizado localmente.');
  console.log('Datos de la película:', pelicula);

  Toastify({
    text: "¡Eliminado de tu listado!",
    duration: 1500,
    gravity: "top",
    className: "toastify",
  }).showToast();

  // Refrescar la página listado.html
  window.location.reload();
}





//BOTONES LISTADO
function vaciar() {
  Swal.fire({
    title: '¿Seguro que quieres vaciar el listado?',
    text: "Esta acción no se puede revertir",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí'
  }).then((result) => {
    if (result.isConfirmed) {
      // Obtener los datos almacenados en el almacenamiento local
      const storedData = JSON.parse(localStorage.getItem('peliculas'));

      if (storedData && storedData.length > 0) {
        // Recorrer todos los elementos en el almacenamiento local y cambiar su valor "listado" a "true"
        storedData.forEach((item) => {
          item.listado = false;
        });

        // Guardar los datos modificados en el almacenamiento local
        localStorage.setItem('peliculas', JSON.stringify(storedData));

        Swal.fire(
          'Listado vaciado',
          'Se han modificado los elementos en el almacenamiento local',
          'success'
        );

        // Refrescar la página listado.html
        window.location.reload();
      } else {
        Swal.fire(
          'No hay elementos en el listado',
          'No se han realizado cambios en el almacenamiento local',
          'info'
        );
      }
    }
  });
}



function exportar() {
  Swal.fire({
    title: 'Ingrese dirección de mail',
    input: 'email',
    inputPlaceholder: 'direccion@mail.com',
    confirmButtonText: 'Enviar',
    showLoaderOnConfirm: true,
    preConfirm: (email) => {
      if (email) {
        return email;
      } else {
        Swal.showValidationMessage('Ingresar dirección valida');
        return false;
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const email = result.value;
      Swal.fire(`Se va a mandar el listado a: ${email}`);
      // Aquí puedes realizar la lógica adicional para exportar con el correo electrónico
      console.log(`Correo electrónico ingresado: ${email}`);
    }
  });
}




// Función para cargar el archivo JSON de forma asíncrona
async function loadJSON() {
  try {
    const response = await fetch('json/data.json');
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    throw new Error('Error al cargar el archivo JSON');
  }
}

(async () => {
  try {
    data = await loadJSON();
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
      const storedData = JSON.parse(localStorage.getItem('peliculas'));
        categoryItems = data.filter(item => {
          const storedItem = storedData.find(storedItem => storedItem.id === item.id);
          return storedItem && storedItem.listado;
        });
    }


    const categoryHtml = categoryItems.map((item, index) => `
      <div class="box" data-id="${item.id}" style="background-image: url(${item.poster})">
        ${item.nombre}
        <div class="overlay">
          <button onclick="${categoryName === 'listado' ? 'eliminarListado' : 'changeListado'}(${item.id}, data)">
            ${categoryName === 'listado' ? 'Eliminar del listado' : 'Agregar al listado'}
          </button>
        </div>
      </div>
    `).join('');

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
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
})();



  
const formulario = document.querySelector('form');
const contenedorResultados = document.querySelector('#peliculas-encontradas');

formulario.addEventListener('submit', function (evento) {
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
      <div class="box" data-id="${item.id}" style="background-image: url(${item.poster})">
      ${item.nombre}
      <div class="overlay">
      <button onclick="changeListado(${item.id}, data)">Agregar al listado</button>
      </div>
    </div>
      `).join('');
    })
});


//SEARCH
$('form').submit(function (event) {
  event.preventDefault(); // detener el comportamiento predeterminado del formulario
  const searchTerm = $('input[name="searchTerm"]').val(); // obtener el término de búsqueda
  window.location.href = `search.html?searchTerm=${searchTerm}`; // redirigir a la página de resultados
});

$(document).ready(function () {
  // Obtén el término de búsqueda de la URL
  const searchParams = new URLSearchParams(window.location.search);
  const searchTerm = searchParams.get('searchTerm');

  if (searchTerm !== null) { // Verifica si searchTerm no es nulo
    // Usa Ajax para obtener los datos del archivo JSON
    $.ajax({
      url: '/json/data.json',
      dataType: 'json',
      success: function (data) {
        // Filtra los resultados para encontrar películas que coincidan con el término de búsqueda
        const results = data.filter(function (movie) {
          return movie.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.año.toString().includes(searchTerm);
        });

        // Crea los elementos HTML para los resultados
        const categoryHtml = results.map((item, index) => `
        <div class="box" data-id="${item.id}" style="background-image: url(${item.poster})">
        ${item.nombre}
        <div class="overlay">
        <button onclick="changeListado(${item.id}, data)">Agregar al listado</button>
        </div>
      </div>
        `).join('');

        // Agrega los elementos HTML al contenedor de resultados
        $('#results').html(`<div class="row">${categoryHtml}</div>`);
      },
      error: function () {
        alert('Error al cargar los datos.');
      }
    });
  }
});