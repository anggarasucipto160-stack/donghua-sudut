const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Endpoint untuk memproses link TikTok
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url || !url.includes('tiktok.com')) {
        return res.status(400).json({ 
            success: false, 
            message: 'Tautan TikTok tidak valid!' 
        });
    }

    try {
        const response = await axios.post('https://www.tikwm.com/api/', {
            url: url,
            hd: 1
        });

        const data = response.data.data;

        if (!data) {
            return res.status(404).json({ 
                success: false, 
                message: 'Gagal mengambil data video. Pastikan akun tidak diprivate.' 
            });
        }

        res.json({
            success: true,
            title: data.title || 'Video TikTok',
            cover: data.cover,
            author: data.author.nickname || data.author.unique_id,
            download_no_wm: `/api/file?url=${encodeURIComponent(data.play)}&title=tiktok_nowatermark`,
            download_hd: data.hdplay ? `/api/file?url=${encodeURIComponent(data.hdplay)}&title=tiktok_hd` : `/api/file?url=${encodeURIComponent(data.play)}&title=tiktok_nowatermark`
        });

    } catch (error) {
        console.error('Error TikTok Parser:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server backend.' 
        });
    }
});

// 2. Endpoint Proxy untuk mendownload file video secara langsung
app.get('/api/file', async (req, res) => {
    const videoUrl = req.query.url;
    const title = req.query.title || 'tiktok_video';

    if (!videoUrl) {
        return res.status(400).send('URL video tidak ditemukan');
    }

    try {
        const streamResponse = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        streamResponse.data.pipe(res);
    } catch (error) {
        console.error('Error Stream File:', error.message);
        res.status(500).send('Gagal mengunduh file video.');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
});
