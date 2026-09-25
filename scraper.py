import json
from bs4 import BeautifulSoup
import requests

# Menggunakan URL halaman episode Perfect World dari situs anichin.moe
target_url = "https://anichin.moe/perfect-world-episode-01-subtitle-indonesia/"

# Mengirim request dengan headers agar tidak diblokir oleh situs
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
response = requests.get(target_url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# Mengambil URL video iframe secara otomatis dari elemen div.video-content
iframe_tag = soup.select_one("div.video-content iframe")
video_url = iframe_tag["src"] if iframe_tag else ""

# Struktur data baru yang memperbarui episode pertama dan menghapus data lama
data = [
    {
        "id": "perfect-world",
        "title": "Perfect World",
        "chineseTitle": "完美世界",
        "genre": ["Action", "Adventure", "Fantasy", "Cultivation"],
        "status": "Ongoing",
        "rating": 8.5,
        "type": "free",
        "poster": "./Images/perfect-world.jpg",
        "description": "Shi Hao adalah seorang anak berbakat yang tumbuh dalam dunia penuh kekuatan.",
        "episodes": [
            {
                "episode_number": 1,
                "title": "Episode 1",
                "video_url": video_url,  # Otomatis terisi link video dari anichin.moe
            }
        ],
    }
]

# Menyimpan hasilnya ke dalam file data.json secara otomatis
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("File data.json berhasil diperbarui secara otomatis!")
