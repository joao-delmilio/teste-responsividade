const apiKey = 'db2ce05cba3af1e8589cedb211b6f6be'; // <-- Substitua pela sua API key

let totalArtistas = 0;
let totalAlbuns = 0;
let totalMusicas = 0;

function atualizarPainel() {
  document.getElementById('total-artistas').innerText = totalArtistas;
  document.getElementById('total-albuns').innerText = totalAlbuns;
  document.getElementById('total-musicas').innerText = totalMusicas;
}

async function buscarDetalhesAlbum(artista, album) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${encodeURIComponent(artista)}&album=${encodeURIComponent(album)}&format=json`;
  
  let resposta = await fetch(url);
  let dados = await resposta.json();

  if (dados.album && dados.album.tracks && dados.album.tracks.track) {
    const tracks = Array.isArray(dados.album.tracks.track) ? dados.album.tracks.track.length : 1;
    return tracks;
  }

  return 0;
}

async function carregarAlbuns(artista, containerId) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artista)}&api_key=${apiKey}&format=json`;

  let resposta = await fetch(url);
  let dados = await resposta.json();

  const listaAlbuns = document.getElementById(containerId);

  const albuns = dados.topalbums.album.slice(0, 4);
  totalArtistas += 1;
  totalAlbuns += albuns.length;

  for (const album of albuns) {
    listaAlbuns.innerHTML += `
      <div class="card-album">
        <img src="${album.image[2]['#text'] || 'https://via.placeholder.com/220'}" alt="Capa do Álbum">
        <h3>${album.name}</h3>
        <p>${album.artist.name}</p>
      </div>
    `;

    const qtdMusicas = await buscarDetalhesAlbum(artista, album.name);
    totalMusicas += qtdMusicas;
    atualizarPainel();
  }
}

// Chamadas para cada artista:
(async () => {
  await carregarAlbuns('Linkin Park', 'linkin-park');
  await carregarAlbuns('Korn', 'korn');
})();
