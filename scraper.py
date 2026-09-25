import json

# Nama file database JSON Anda
DATA_FILE = 'data.json'

def update_data():
    try:
        # Membaca data yang ada di data.json
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        data = []

    print(f"Berhasil memuat {len(data)} data donghua.")

    # Menyimpan kembali perubahan ke data.json
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print("File data.json berhasil diperbarui!")

if __name__ == "__main__":
    update_data()
  
