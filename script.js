l   loadLinksFromFile();
});
/ Función para cargar los datos desde el archivo .txt
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

