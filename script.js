let linksData = [];
let allHashtags = new Set(); 
let currentHashtags = []; 

// Parsear los datos del archivo .txt
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

// Resetear filtros
function resetFilters() {
    document.getElementById('search').value = '';
    currentHashtags = [];
    displayLinks(linksData);
}

// Buscar links
function searchLinks() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredLinks = linksData.filter(link => {
        return link.title.toLowerCase().includes(query) ||
               link.hashtags.some(hashtag => hashtag.toLowerCase().includes(query));
    });
    displayLinks(filteredLinks);
}

// Mostrar todos los links (sin paginación)
function displayLinks(links) {
    const linksList = document.getElementById('linksList');
    const hashtagsList = document.getElementById('hashtagsList');
    
    linksList.innerHTML = '';
    hashtagsList.innerHTML = '';
    
    const filteredLinks = links.filter(link => {
        if (currentHashtags.length === 0) return true;
        return link.hashtags.some(hashtag => currentHashtags.includes(hashtag));
    });

    // Mostrar todos los links directamente
    filteredLinks.forEach(link => {
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

    // Listado de hashtags globales
    const sortedHashtags = Array.from(allHashtags).sort((a, b) => a.localeCompare(b));
    hashtagsList.innerHTML = sortedHashtags.map(hashtag => {
        return `<span class="hashtag" onclick="filterByHashtag('${hashtag}')">${hashtag}</span>`;
    }).join(' ');
}

// Filtrar por hashtag
function filterByHashtag(hashtag) {
    currentHashtags = [hashtag];
    displayLinks(linksData);
}

// Formatear fecha
function formatDate(dateString) {
    const dateParts = dateString.split('/');
    return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
}

// Cargar links desde archivo
function loadLinksFromFile() {
    fetch('links.txt')
        .then(response => response.text())
        .then(data => {
            linksData = parseLinks(data);
            allHashtags.clear();
            linksData.forEach(link => {
                link.hashtags.forEach(hashtag => allHashtags.add(hashtag));
            });
            updateLinkCounter(linksData.length);
            displayLinks(linksData);
        });
}

// Contador de links
function updateLinkCounter(totalLinks) {
    const counterDiv = document.getElementById('contador-links');
    counterDiv.innerHTML = `<span>${totalLinks} links añadidos hasta la fecha</span>`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadLinksFromFile();
});