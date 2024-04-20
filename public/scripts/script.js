document.addEventListener("DOMContentLoaded", function() {
    const albumList = document.querySelector('#albumList ul');
    const currentAlbum = document.getElementById('currentAlbum');
    const form = document.getElementById("albumForm");

    function fetchAlbums() {
        fetch('/albums')
            .then(response => response.json())
            .then(data => {
                albumList.innerHTML = '';
                data.forEach((album, index) => {
                    const li = document.createElement('li');
                    li.textContent = `${album.title} by ${album.artist} | Genre: ${album.genre}`;
                    li.onclick = () => updateNowPlaying(index);
                    albumList.appendChild(li);
                })
            })
            .catch(error => console.error('Error fetching albums: ', error));
    }

    function updateNowPlaying(index){
        fetch('/albums')
            .then(response => response.json())
            .then(albums => {
                const album = albums[index];
                currentAlbum.innerHTML = `<strong>${album.title}</strong> by ${album.artist}<br><img src="${album.coverArtUrl}" alt="${album.title}" class="cover-img">`
            })
            .catch(error => console.error('Error updating now playing section: ', error));
    }

    form.addEventListener('submit', function (event) {
        // event.preventDefault();
        const newAlbum = {
            title: document.getElementById('title').value,
            artist: document.getElementById('artist').value,
            genre: document.getElementById('genre').value,
            coverArtUrl: document.getElementById('coverArtUrl').value,
        };
        fetch('/albums', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAlbum)
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Failed to add the album');
            }
            return response.JSON();
        })
        .then(() => {
            fetchAlbums();
            form.reset();
        })
        .catch(error => console.error("Error posting new album: ", error));
    })

    fetchAlbums();
})