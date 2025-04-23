const express = require('express');
const ytdlp = require('yt-dlp-exec').create('./bin/yt-dlp');
const app = express();
const port = 3000;

app.get('/info', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing ?url parameter');

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true
    });

    res.json({
      developer: "ehsan fazli",
      title: info.title,
      artist: info.artist || info.uploader,
      album: info.album || 'Unknown',
      thumbnail: info.thumbnail,
      description: info.description,
      duration: info.duration,
      webpage_url: info.webpage_url,
      download_url: info.url,
      formats: info.formats.map(f => ({
        format_note: f.format_note,
        ext: f.ext,
        filesize: f.filesize,
        audio_quality: f.audio_quality,
        url: f.url
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error extracting metadata');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
