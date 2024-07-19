# YTDL/CORE/AUD

![Youtube](https://i.postimg.cc/LXWmBnHM/images.png)

## Instalacion

```bash
npm install github:HanSamu-27/ytdl-core
```

## Uso:

```javascript
const { youtubedl } = require('ytdl-core')

const url = 'https://music.youtube.com/watch?v=HBqH4uJS0PU&si=vf1ddWGR3Q_lHfbP'

downloadAndTagAudio(url)
  .then(result => {
    console.log(`Título: ${result.title}`);
    console.log(`Artista: ${result.artist}`)
    console.log(`Imagen: ${result.coverPath}`)
    console.log(`Audio en base64: ${result.audioBase64}`)
  })
  .catch(error => {
    console.error('Error:', error)
  });
```
