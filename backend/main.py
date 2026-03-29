import os
import io
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from pydantic import BaseModel

app = FastAPI(title="FructaVision API")

# Setup CORS to allow React frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration (Hugging Face Space filenames)
FRUIT_MODEL_PATH = "./fruit_model.h5"
FRESHNESS_MODEL_PATH = "./freshness_model.h5"
TARGET_SIZE = (224, 224)

# Classes based on the user's provided app.py
FRUIT_CLASSES = ['apple', 'banana', 'grapes', 'guava']
FRESHNESS_CLASSES = ['Fresh', 'Mid', 'Rotten']

# Load models globally
models = {}

def load_models():
    try:
        if os.path.exists(FRUIT_MODEL_PATH) and os.path.exists(FRESHNESS_MODEL_PATH):
            models['fruit'] = tf.keras.models.load_model(FRUIT_MODEL_PATH)
            models['freshness'] = tf.keras.models.load_model(FRESHNESS_MODEL_PATH)
            print("Both models loaded successfully!")
        else:
            if not os.path.exists(FRUIT_MODEL_PATH):
                print(f"Warning: Fruit model not found at {FRUIT_MODEL_PATH}")
            if not os.path.exists(FRESHNESS_MODEL_PATH):
                print(f"Warning: Freshness model not found at {FRESHNESS_MODEL_PATH}")
    except Exception as e:
        print(f"Error loading models: {e}")

load_models()


class AnalysisResponse(BaseModel):
    fruit: str
    freshness: str
    confidence: float
    shelfLife: str


def get_shelf_life(fruit, freshness):
    # Mapping 'Mid' -> 'Ripe', 'Rotten' -> 'Overripe' for logic alignment
    shelf_map = {
        "banana": {"Fresh": "2–3 days", "Mid": "1 day", "Rotten": "0 days"},
        "apple": {"Fresh": "5–7 days", "Mid": "2–3 days", "Rotten": "0 days"},
        "grapes": {"Fresh": "3–5 days", "Mid": "1–2 days", "Rotten": "0 days"},
        "guava": {"Fresh": "2–4 days", "Mid": "1–2 days", "Rotten": "0 days"},
    }
    return shelf_map.get(fruit.lower(), {}).get(freshness, "Unknown")


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Converts binary image data into a numpy array ready for the dual models.
    Uses MobileNetV2 preprocessing as per the original app.py logic.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(TARGET_SIZE)
    img_array = np.array(image)

    # Ensure 3 channels (handled by .convert("RGB") above)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    if 'fruit' not in models or 'freshness' not in models:
        raise HTTPException(
            status_code=503, 
            detail="AI Models are not loaded. Ensure fruit_model.h5 and freshness_model.h5 exist."
        )

    try:
        image_bytes = await file.read()
        processed_image = preprocess_image(image_bytes)
        
        # 1. Fruit Prediction
        fruit_preds = models['fruit'].predict(processed_image)
        fruit_idx = np.argmax(fruit_preds[0])
        fruit = FRUIT_CLASSES[fruit_idx] if fruit_idx < len(FRUIT_CLASSES) else "Unknown"
        fruit_conf = float(np.max(fruit_preds[0]))

        # 2. Freshness Prediction
        fresh_preds = models['freshness'].predict(processed_image)
        fresh_idx = np.argmax(fresh_preds[0])
        raw_freshness = FRESHNESS_CLASSES[fresh_idx] if fresh_idx < len(FRESHNESS_CLASSES) else "Mid"
        fresh_conf = float(np.max(fresh_preds[0]))

        # 3. Shelf Life Calculation
        shelf_life = get_shelf_life(fruit, raw_freshness)

        # 4. Final Mapping for Frontend (UI friendly)
        # Frontend expects: 'Fresh', 'Ripe', 'Overripe'
        freshness_mapping = {
            "Fresh": "Fresh",
            "Mid": "Ripe",
            "Rotten": "Overripe"
        }
        ui_freshness = freshness_mapping.get(raw_freshness, "Ripe")

        # Average confidence for binary classification display
        avg_confidence = round((fruit_conf + fresh_conf) / 2, 2)

        # 5. Confidence Threshold (90%)
        # If the fruit detection is not certain enough, we return 'Undefined'
        final_fruit = fruit.capitalize()
        final_freshness = ui_freshness
        final_shelf_life = shelf_life

        if fruit_conf < 0.90:
            final_fruit = "Undefined"
            final_freshness = "N/A"
            final_shelf_life = "N/A"

        return {
            "fruit": final_fruit,
            "freshness": final_freshness,
            "confidence": avg_confidence,
            "shelfLife": final_shelf_life
        }

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    # Port 7860 is the default for Hugging Face Spaces
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
