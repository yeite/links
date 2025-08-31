let linksData = [];
let allHashtags = new Set(); // Lista completa de hashtags
let currentPage = 1;
const itemsPerPage = 5;
let currentHashtags = []; // Ahora limpiamos los hashtags cuando hacemos clic en uno

// Funci�n para cargar los datos desde el archivo .txt
function loadLinksFromFile() {
    fetch('links.txt')
        .then(response => response.text())
        .then(data => {
            linksData = parseLinks(data);
            // Obtener todos los hashtags desde el principio
            linksData.forEach(link => {
                link.hashtags.forEach(hashtag => allHashtags.add(hashtag));
            });
            displayLinks(linksData);
        });
}

// Parsear los datos del archivo .txt a un formato JSON adecuado
function parseLinks(data) {
    const links = [];
    const lines = data.split('\n');
    lines.forEach(line => {
        const parts = line.split('|');
        if (parts.length >= 4) {
            const title = parts[0].trim();
            const url = parts[1].trim();
            const hashtags = parts[2].split(',').map(tag => tag.trim());
            const date = parts[3].trim();
            links.push({ title, url, hashtags, date });
        }
    });
    return links;
}

// Limpiar filtros al hacer clic en el t�tulo
function resetFilters() {
    document.getElementById('search').value = '';
    currentHashtags = []; // Resetear los hashtags filtrados
    displayLinks(linksData);
}

// Buscar links por el t�rmino de b�squeda
function searchLinks() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredLinks = linksData.filter(link => {
        return link.title.toLowerCase().includes(query) || link.hashtags.some(hashtag => hashtag.toLowerCase().includes(query));
    });
    displayLinks(filteredLinks);
}

// Mostrar links con paginaci�n
function displayLinks(links) {
    const linksList = document.getElementById('linksList');
    const hashtagsList = document.getElementById('hashtagsList');
    const pagination = document.getElementById('pagination');

    linksList.innerHTML = '';
    hashtagsList.innerHTML = '';
    pagination.innerHTML = '';

    // Filtrar por hashtags si hay alguno seleccionado
    const filteredLinks = links.filter(link => {
        if (currentHashtags.length === 0) return true; // Si no hay hashtags filtrados, mostrar todos
        return link.hashtags.some(hashtag => currentHashtags.includes(hashtag));
    });

    // Paginaci�n
    const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);

    // Si hay m�s de una p�gina, mostramos los botones de paginaci�n
    pagination.style.display = totalPages > 1 ? 'block' : 'none';

    // Determinar el �ndice de inicio y final de los elementos de la p�gina actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLinks = filteredLinks.slice(startIndex, startIndex + itemsPerPage);

    // Mostrar los links filtrados
    paginatedLinks.forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.classList.add('link-item');
        linkItem.innerHTML = `
            <h3><a href="${link.url}" target="_blank">${link.title}</a></h3>
            <p>
                ${link.hashtags.map(hashtag => {
                    return `<span class="hashtag" onclick="filterByHashtag('${hashtag}')">${hashtag}</span>`;
                }).join(' ')} | ${formatDate(link.date)}
            </p>
        `;
        linksList.appendChild(linkItem);
    });

    // Mostrar todos los hashtags sin importar el filtro, ordenados alfab�ticamente
    const sortedHashtags = Array.from(allHashtags).sort((a, b) => a.localeCompare(b)); // Ordenar los hashtags alfab�ticamente
    hashtagsList.innerHTML = sortedHashtags.map(hashtag => {
        return `<span class="hashtag" onclick="filterByHashtag('${hashtag}')">${hashtag}</span>`;
    }).join(' ');

    // Mostrar paginaci�n solo si hay m�s de una p�gina
    if (totalPages > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 1;
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                displayLinks(filteredLinks);
            }
        };

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.disabled = currentPage === totalPages;
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayLinks(filteredLinks);
            }
        };

        pagination.appendChild(prevButton);
        pagination.appendChild(nextButton);
    }
}

// Filtrar links por hashtag
function filterByHashtag(hashtag) {
    // Limpiar el filtro de hashtags anterior y agregar el nuevo
    currentHashtags = [hashtag]; // Reemplazamos el filtro actual con el nuevo
    currentPage = 1; // Resetear a la primera pagina cuando cambiamos los filtros
    displayLinks(linksData); // Mostrar los links filtrados por hashtags
}

// Formatear la fecha a dd/mm/aaaa
function formatDate(dateString) {
    const dateParts = dateString.split('/');
    return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
}

// Cargar los links cuando la pagina se cargue
document.addEventListener('DOMContentLoaded', () => {
    loadLinksFromFile();
});

// Función para cargar los datos desde el archivo .txt
function loadLinksFromFile() {
    fetch('links.txt')
        .then(response => response.text())
        .then(data => {
            linksData = parseLinks(data);
            
            // Obtener todos los hashtags desde el principio
            linksData.forEach(link => {
                link.hashtags.forEach(hashtag => allHashtags.add(hashtag));
            });

            // Actualizar el contador de links
            updateLinkCounter(linksData.length);

            // Mostrar los links en la página
            displayLinks(linksData);
        });
}

// Actualizar el contador de links totales
function updateLinkCounter(totalLinks) {
    const counterDiv = document.getElementById('contador-links');
    counterDiv.innerHTML = `<span>${totalLinks} links añadidos hasta la fecha</span>`;
}

