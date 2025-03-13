from fastapi import FastAPI
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

app = FastAPI()
reader = SimpleMFRC522()

@app.get("/read-rfid")
async def read_rfid():
    try:
        print("Waiting for RFID token...")
        id, text = reader.read()
        return {"token": str(id)}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
