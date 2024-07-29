const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const { parse } = require('node-id3');

const app = express();
const PORT = process.env.PORT || 2001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.xml'));
});

app.post('/download', async (req, res) => {
  const youtubeUrl = req.body.youtubeUrl;
  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const audioUrl = audioFormats[0].url;
    const filePath = path.join(__dirname, 'public', `${info.videoDetails.title}.mp3`);
    const audioStream = ytdl.downloadFromInfo(info, { filter: 'audioonly' });
    audioStream.pipe(fs.createWriteStream(filePath));
    audioStream.on('end', () => {
      const tags = {
        title: info.videoDetails.title,
        artist: info.videoDetails.author.name,
        image: info.videoDetails.thumbnails[0].url,
      };

      parse(filePath, (err, parsedTags) => {
        if (err) throw err;
        const mergedTags = { ...tags, ...parsedTags };
        nodeID3.write(mergedTags, filePath);
        res.download(filePath, (err) => {
          if (err) console.error(err);
          fs.unlinkSync(filePath);
        });
      });
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error al procesar la solicitud');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
