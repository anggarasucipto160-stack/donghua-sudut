export default async function handler(req, res) {
  // 1. Izinkan CORS dari domain cPanel Anda
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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method tidak diizinkan.' });
  }

  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Tautan TikTok wajib diisi!' });
    }

    // 2. Kirim permintaan ke TikWM API
    const response = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: new URLSearchParams({
        url: url,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1
      })
    });

    const data = await response.json();

    // 3. Pengecekan hasil dari TikWM
    if (data.code === 0 && data.data) {
      const videoData = data.data;

      // Ambil link video tanpa watermark dan HD
      const downloadNoWm = videoData.play;
      const downloadHd = videoData.hdplay || videoData.play;

      return res.status(200).json({
        success: true,
        title: videoData.title || 'Video TikTok',
        author: videoData.author ? videoData.author.nickname || videoData.author.unique_id : 'Pengguna TikTok',
        cover: videoData.cover,
        download_no_wm: downloadNoWm,
        download_hd: downloadHd
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.msg || 'Gagal mengambil data video. Pastikan link valid dan video tidak diprivat.'
      });
    }
  } catch (error) {
    console.error('Error Vercel:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server .'
    });
  }
}
