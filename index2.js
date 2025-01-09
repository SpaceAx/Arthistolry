const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');
const hxz = require('hxz-api');
const xfarr = require('xfarr-api');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

const kodebhs = [
  'vn', 'en', 'he', 'zh', 'ch', 'id', 'ko', 'ph', 'ru', 'ar', 'ms', 'es', 'pt',
  'de', 'th', 'ja', 'fr', 'sv', 'tr', 'da', 'nb', 'it', 'nl', 'fi', 'ml', 'hi',
  'kh', 'ca', 'ta', 'rs', 'mn', 'fa', 'pa', 'cy', 'hr', 'el', 'az', 'sw', 'te',
  'pl', 'ro', 'si', 'fy', 'kk', 'cs', 'hu', 'lt', 'be', 'br', 'af', 'bg', 'is',
  'uk', 'jv', 'eu', 'rw', 'or', 'al', 'bn', 'gn', 'kn', 'my', 'sk', 'gl', 'gu',
  'ps', 'ka', 'et', 'tg', 'as', 'mr', 'ne', 'ur', 'uz', 'cx', 'hy', 'lv', 'sl',
  'ku', 'mk', 'bs', 'ig', 'lb', 'mg', 'ny', 'sn', 'tt', 'yo', 'co', 'eo', 'ga',
  'hm', 'hw', 'lo', 'mi', 'so', 'ug', 'am', 'gd'
];

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/*app.get('/youtube', async (req, res) => {
  const { url } = req.query;

  if (typeof url !== 'string' || !isValidYouTubeURL(url)) {
    return res.status(400).json({
      status: false,
      creator: "@SpaceAx",
      result: "Masukkan URL YouTube yang valid"
    });
  }

  try {
    const info = await ytdl.getInfo(url);
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    const videoDownloadLink = videoFormat.url;

    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const audioFormat = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
    const audioDownloadLink = audioFormat.url;

    const response = {
      status: true,
      creator: "@SpaceAx",
      result: {
        videoTitle: info.videoDetails.title,
        videoDescription: info.videoDetails.description,
        videoDuration: `${info.videoDetails.lengthSeconds} seconds`,
        videoThumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
        videoDownloadLink: videoDownloadLink,
        audioDownloadLink: audioDownloadLink
      }
    };

    return res.json(response);
  } catch (error) {
    console.error("Error processing YouTube link:", error);
    return res.status(500).json({
      status: false,
      creator: "@SpaceAx",
      result: "Terjadi kesalahan saat memproses tautan YouTube"
    });
  }
});

function isValidYouTubeURL(url) {
  // Validasi panjang URL dan formatnya di sini
  // Contoh: Anda dapat menggunakan ekspresi reguler untuk memeriksa format URL
  return /^https:\/\/www\.youtube\.com\/watch\?/.test(url);
}*/

app.get('/youtube', async (req, res) => {
  const { url } = req.query;

  if (typeof url !== 'string' || !ytdl.validateURL(url)) {
    return res.status(400).json({
      status: false,
      creator: "@SpaceAx",
      result: "Masukkan URL YouTube yang valid"
    });
  }

  try {
    const info = await ytdl.getInfo(url);
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    const videoDownloadLink = videoFormat.url;

    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const audioFormat = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
    const audioDownloadLink = audioFormat.url;

    const response = {
      status: true,
      creator: "@SpaceAx",
      result: {
        videoTitle: info.videoDetails.title,
        videoDescription: info.videoDetails.description,
        videoDuration: `${info.videoDetails.lengthSeconds} seconds`,
        videoThumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
        videoDownloadLink: videoDownloadLink,
        audioDownloadLink: audioDownloadLink
      }
    };

    return res.json(response);
  } catch (error) {
    const response = {
      status: false,
      creator: "@SpaceAx",
      result: "Invalid URL or Error processing YouTube link"
    };
    return res.status(500).json(response);
  }
});

app.get('/chatsimsimi', async (req, res) => {
  const { message, bahasanya } = req.query;

  if (typeof message !== 'string') {
    return res.status(400).json({
      status: false,
      creator: "@SpaceAx",
      result: "Masukkan messagenya"
    });
  } else if (!kodebhs.includes(bahasanya)) {
    return res.status(400).json({
      status: false,
      creator: "@SpaceAx",
      result: "Kode Bahasa Tidak Di Dukung",
      kodebahasa: kodebhs
    });
  }

  const options = new URLSearchParams();
  options.append('text', message);
  options.append('lc', bahasanya);

  try {
    const response = await axios.post('https://api.simsimi.vn/v2/simtalk', options);
    const simiResponse = response.data.message.replace(/Simi/gi, 'SpaceAx').replace(/simsimi/g, 'SpaceAx');
    const jsn = {
      status: true,
      creator: "@SpaceAx",
      result: simiResponse
    };

    return res.json(jsn);
  } catch (error) {
    const jstn = {
      status: false,
      creator: "@SpaceAx",
      result: "Maaf Saya Tidak Mengerti Apa Yang Kamu Katakan"
    };
    return res.status(500).json(jstn);
  }
});

app.get('/pinterest', async (req, res) => {
  const { query } = req.query;

  if (typeof query !== 'string') {
    return res.status(400).json({
      status: false,
      creator: "@SpaceAx",
      result: "Masukkan query"
    });
  }

  try {
    hxz.pinterest(query).then(async (data) => {
      function getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex]
      }
      const randomItem = getRandomElement(data)
      if (randomItem === undefined) {
        xfarr.search.pinterest(query).then(async (dt) => {
          const hsl = dt.url
          const response = {
            status: true,
            creator: "@SpaceAx",
            result: hsl
          };

          return res.json(response);
        }).catch((error) => {
          console.error(error);
          const response = {
            status: false,
            creator: "@SpaceAx",
            result: "Tidak Dapat Menemukan Dalam Pinterest."
          };
          return res.status(500).json(response);
        });
      } else {
        const rdm = randomItem
        const response = {
          status: true,
          creator: "@SpaceAx",
          result: rdm
        };

        return res.json(response);
      }
    });
  } catch (error) {
    const response = {
      status: false,
      creator: "@SpaceAx",
      result: "Tidak Dapat Menemukan Dalam Pinterest."
    };
    return res.status(500).json(response);
  }
});

app.get('/chatgpt', async (req, res) => {
  const { userInput, apiKey } = req.query;

  if (typeof userInput !== 'string') {
    return res.status(400).json({
      status: false,
      creator: "@SpaceAx",
      result: "Masukkan input dari user"
    });
  }

  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({
      status: false,
      creator: "@SpaceAx",
      result: "Masukkan OpenAI API key"
    });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: userInput }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const data = response.data;
    const outputText = data.choices[0].message.content;

    return res.json({
      status: true,
      creator: "@SpaceAx",
      result: outputText
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      creator: "@SpaceAx",
      result: "Terjadi kesalahan pada server"
    });
  }
});

app.get('/chatgptImg', async (req, res) => {
  const { userInput, apiKey } = req.query;

  if (typeof userInput !== 'string' || typeof apiKey !== 'string') {
    return res.status(400).json({
      status: false,
      creator: "@SpaceAx",
      result: "Periksa input dan kunci API"
    });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: userInput,
        n: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    const data = response.data;
    const image = data.data[0].url;

    return res.json({
      status: true,
      creator: "@SpaceAx",
      result: image
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      creator: "@SpaceAx",
      result: "Terjadi kesalahan pada server"
    });
  }
});

app.get('/wallpaper', async (req, res) => {
  const { text } = req.query;

  if (typeof text !== 'string') {
    return res.status(400).json({
      status: false,
      creator: "@SpaceAx",
      result: "Masukkan teks untuk mencari wallpaper"
    });
  }

  try {
    hxz.chara(text).then(async(data) => {
      function getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex]
      }
      const randomItem = getRandomElement(data)

      if (randomItem === undefined) {
        return res.status(404).json({
          status: false,
          creator: "@SpaceAx",
          result: "Tidak dapat menemukan gambar wallpaper."
        });
      } else {
        const response = {
          status: true,
          creator: "@SpaceAx",
          result: randomItem
        };
        return res.json(response);
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      creator: "@SpaceAx",
      result: "Terjadi kesalahan pada server"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
