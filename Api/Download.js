const axios = require('axios');

module.exports = async (req, res) => {
    // Pengaturan Header CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Pengecekan Tes Server
    if (req.method === 'GET') {
        return res.json({ success: true, message: 'API Vercel TikTokSave Berjalan Normal! 🚀' });
    }

    // Proses Download TikTok
    if (req.method === 'POST') {
        const { url } = req.body || {};

        if (!url || !/(tiktok\.com)/i.test(url)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tautan TikTok tidak valid!' 
            });
        }

        try {
            const response = await axios.post('https://www.tikwm.com/api/', {
                url: url,
                hd: 1
            }, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const data = response.data.data;

            if (!data) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Gagal mengambil data video. Pastikan akun tidak privat.' 
                });
            }

            return res.json({
                success: true,
                title: data.title || 'Video TikTok',
                cover: data.cover,
                author: data.author.nickname || data.author.unique_id,
                download_no_wm: data.play,
                download_hd: data.hdplay || data.play
            });

        } catch (error) {
            console.error('Error TikTok Parser:', error.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Terjadi kesalahan pada server backend.' 
            });
        }
    }

    return res.status(405).json({ success: false, message: 'Method tidak diizinkan' });
};
