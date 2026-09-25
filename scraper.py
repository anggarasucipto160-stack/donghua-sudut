import json
from bs4 import BeautifulSoup
import requests

# 1. URL halaman episode Perfect World dari situs anichin.moe
target_url = "https://anichin.moe/perfect-world-episode-01-subtitle-indonesia/"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

try:
  response = requests.get(target_url, headers=headers, timeout=15)
  response.raise_for_status()
  soup = BeautifulSoup(response.text, "html.parser")

  # Mengambil URL video iframe secara otomatis dengan aman
  iframe_tag = soup.select_one("div.video-content iframe")
  if iframe_tag and iframe_tag.has_attr("src"):
    video_url = iframe_tag["src"]
  else:
    video_url = ""

  # 2. Baca file data.json yang sudah ada
  try:
    with open("data.json", "r", encoding="utf-8") as f:
      data = json.load(f)
  except (FileNotFoundError, json.JSONDecodeError):
    data = []

  # Jika data bukan berupa list, jadikan list kosong
  if not isinstance(data, list):
    data = []

  # 3. Data baru untuk Perfect World
  perfect_world_data = {
      "id": "perfect-world",
      "title": "Perfect World",
      "chineseTitle": "完美世界",
      "genre": ["Action", "Adventure", "Fantasy", "Cultivation"],
      "status": "Ongoing",
      "rating": 8.5,
      "type": "free",
      "poster": "./Images/perfect-world.jpg",
      "description": (
          "Shi Hao adalah seorang anak berbakat yang tumbuh dalam dunia penuh"
          " kekuatan."
      ),
      "episodes": [
          {
              "episode_number": 1,
              "title": "Episode 1",
              "video_url": video_url,
          }
      ],
  }

  # 4. Cek apakah "perfect-world" sudah ada di dalam list data.json
  found = False
  for item in data:
    if item.get("id") == "perfect-world":
      item["episodes"] = perfect_world_data["episodes"]
      found = True
      break

  # Jika belum ada sama sekali, tambahkan sebagai data baru di samping Renegade Immortal
  if not found:
    data.append(perfect_world_data)

  # 5. Simpan kembali semuanya ke file data.json
  with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

  print("File data.json berhasil diperbarui dengan Perfect World!")

except Exception as e:
  print(f"Terjadi kesalahan: {e}")
