from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from aethos import AETHOS

app = FastAPI()
aethos = AETHOS()

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Example React frontend URL
    "http://127.0.0.1:3000",   # Example React frontend URL with IP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Add OPTIONS here
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    query: str

@app.post("/api/aethos/search")
async def search(query: SearchQuery):
    results = aethos.search(query.query)
    return results

@app.get("/api/aethos/stats")
async def stats():
    return {
        "agency_stats": aethos.get_agency_stats(),
        "language_stats": aethos.get_languages_stats()[:10],  # Top 10 languages
        "usage_type_stats": aethos.get_usage_type_stats()
    }

@app.get("/api/aethos/status")
async def status():
    return {"status": "ready", "repo_count": len(aethos.repos)}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
