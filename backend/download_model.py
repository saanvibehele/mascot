import os
import urllib.request
import sys

MODEL_URL = "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf"
OUTPUT_PATH = "models/weights/Llama-3.2-1B-Instruct-Q4_K_M.gguf"

def report_hook(count, block_size, total_size):
    if total_size > 0:
        percent = int(count * block_size * 100 / total_size)
        sys.stdout.write(f"\rDownloading model... {percent}%")
        sys.stdout.flush()

if __name__ == "__main__":
    if os.path.exists(OUTPUT_PATH):
        print(f"Model already exists at {OUTPUT_PATH}")
        sys.exit(0)
    
    print(f"Starting download from {MODEL_URL}")
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    try:
        urllib.request.urlretrieve(MODEL_URL, OUTPUT_PATH, reporthook=report_hook)
        print("\nDownload complete!")
    except Exception as e:
        print(f"\nError downloading model: {e}")
        if os.path.exists(OUTPUT_PATH):
            os.remove(OUTPUT_PATH)
        sys.exit(1)
