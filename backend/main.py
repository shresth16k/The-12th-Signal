from fastapi import FastAPI

app = FastAPI(title="The 12th Signal API", description="GenAI stadium-operations system for FIFA World Cup 2026")

@app.get("/")
def read_root():
    return {"status": "OK", "message": "The 12th Signal Backend API is running"}
