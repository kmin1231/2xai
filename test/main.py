# test/main.py

from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, conlist
from dotenv import load_dotenv
import json
import os
import jwt
import logging
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FASTAPI")

app = FastAPI()



### CORS
origins = [
    "http://localhost:3200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
###


### load .env
load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

if SECRET_KEY:
    print("Successfully loaded .env file. SECRET_KEY is set.")
else:
    print("Failed to load .env file or SECRET_KEY is not set.")
###


###
bearer_scheme = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    token = credentials.credentials   # extract token
    logger.info(f"Verifying token: {token}")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info(f"Token payload: {payload}")

        user_id = payload.get("userId")
        role = payload.get("role")
        inferred_level = payload.get("inferredLevel")
        assigned_level = payload.get("assignedLevel")
        
        logger.info(f"User ID: {user_id}, Role: {role}, Inferred Level: {inferred_level}, Assigned Level: {assigned_level}")
        
        if role != 'student':
            raise HTTPException(status_code=403, detail="Access forbidden: You don't have permission to access this resource.")

        return {
            "user_id": user_id,
            "role": role,
            "inferred_level": inferred_level,
            "assigned_level": assigned_level
        }

    except jwt.ExpiredSignatureError:
        logger.error("Token has expired.")
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        logger.error("Invalid token.")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Token validation failed: {str(e)}")

        raise HTTPException(status_code=403, detail=f"Token validation failed: {str(e)}")


### API response sample files (JSON)
base_dir = os.path.dirname(__file__)

FILE_PATHS = {
    "low": {
        "Artificial Intelligence": os.path.join(base_dir, "data", "serverResponseLow_AI.json"),
        "Harry Potter": os.path.join(base_dir, "data", "serverResponseLow_HP.json"),
        "pyramid": os.path.join(base_dir, "data", "serverResponseLow_PY.json"),
    },
    "middle": {
        "baseball": os.path.join(base_dir, "data", "serverResponseMiddle_BB.json"),
        "Premier League": os.path.join(base_dir, "data", "serverResponseMiddle_PL.json"),
    },
    "high": {
        "baseball": os.path.join(base_dir, "data", "serverResponseHigh_BB.json"),
        "global warming": os.path.join(base_dir, "data", "serverResponseHigh_GW.json"),
        "intellectual property": os.path.join(base_dir, "data", "serverResponseHigh_IP.json"),
        "Pride and Prejudice": os.path.join(base_dir, "data", "serverResponseHigh_PP.json"),
    }
}


def normalize(text: str) -> str:
    normalized_text = re.sub(r'[^a-zA-Z0-9]', '', text.lower())
    return normalized_text

def get_file_path_by_level(level: str, keyword: str) -> str:
    level = normalize(level)
    keyword_normalized = normalize(keyword)

    print(f"Searching for keyword '{keyword}' (normalized: '{keyword_normalized}') at level '{level}'")

    if level not in FILE_PATHS:
        raise ValueError(f"Level '{level}' is not valid.")

    level_data = FILE_PATHS[level]

    if not isinstance(level_data, dict):
        raise ValueError(f"No keyword-based files defined for level '{level}'")

    print(f"Available keywords in level '{level}':")
    for k, path in level_data.items():
        print(f" - '{k}' (normalized: '{normalize(k)}')")

    for k, path in level_data.items():
        print(f"Checking '{k}' (normalized: '{normalize(k)}') against '{keyword_normalized}'")
        if normalize(k) == keyword_normalized:
            print(f"Found file path: {path}")
            return path

    raise ValueError(f"Keyword '{keyword}' not found in level '{level}'")
###


### model
class RequestModel(BaseModel):
    keyword: str

class Generation(BaseModel):
    title: str
    passage: str
    question: conlist(str, min_items=5, max_items=5)
    answer: conlist(str, min_items=5, max_items=5)
    solution: conlist(str, min_items=5, max_items=5)

class SampleResponse(BaseModel):
    keyword: str
    level: str
    generation0: Generation
    generation1: Generation
    generation2: Generation
###


### router
@app.get("/")
def read_root():
    return {"ALGORITHM": ALGORITHM}


@app.get("/docs")
async def get_swagger():
    return JSONResponse({
        "securityDefinitions": {
            "BearerAuth": {
                "type": "apiKey",
                "in": "header",
                "name": "Authorization"
            }
        }
    })

###

@app.post("/generate/low", response_model=SampleResponse)
async def generate_low(request: RequestModel, user_info: dict = Depends(verify_token)):
    user_level = user_info.get("inferred_level")

    if user_level != "low":
        raise HTTPException(status_code=403, detail="User does not have access to 'low' level")

    try:
        file_path = get_file_path_by_level("low", request.keyword)
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        # print(f"Loaded data: {data}")
        
        # keyword check
        if normalize(request.keyword) != normalize(data.get("keyword", "")):
            logger.error(f"Keyword mismatch: expected {data.get('keyword')}, got {request.keyword}")
            raise HTTPException(status_code=400, detail="Invalid keyword provided.")

        response_data = SampleResponse(
            keyword=request.keyword,
            level=user_level,
            generation0=Generation(**data.get("generation0")),
            generation1=Generation(**data.get("generation1")),
            generation2=Generation(**data.get("generation2"))
        )

        return response_data

    except ValueError as ve:
        logger.error(str(ve))
        raise HTTPException(status_code=400, detail=str(ve))
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        raise HTTPException(status_code=500, detail="Internal server error. Data file missing.")
    except json.JSONDecodeError:
        logger.error("Error decoding JSON data.")
        raise HTTPException(status_code=500, detail="Internal server error. Failed to parse data.")


###


@app.post("/generate/middle", response_model=SampleResponse)
async def generate_middle(request: RequestModel, user_info: dict = Depends(verify_token)):
    user_level = user_info.get("inferred_level")

    if user_level != "middle":
        raise HTTPException(status_code=403, detail="User does not have access to 'middle' level")

    try:
        file_path = get_file_path_by_level("middle", request.keyword)
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        if normalize(request.keyword) != normalize(data.get("keyword", "")):
            logger.error(f"Keyword mismatch: expected {data.get('keyword')}, got {request.keyword}")
            raise HTTPException(status_code=400, detail="Invalid keyword provided.")

        response_data = SampleResponse(
            keyword=request.keyword,
            level=user_level,
            generation0=Generation(**data.get("generation0")),
            generation1=Generation(**data.get("generation1")),
            generation2=Generation(**data.get("generation2"))
        )

        return response_data

    except ValueError as ve:
        logger.error(str(ve))
        raise HTTPException(status_code=400, detail=str(ve))
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        raise HTTPException(status_code=500, detail="Internal server error. Data file missing.")
    except json.JSONDecodeError:
        logger.error("Error decoding JSON data.")
        raise HTTPException(status_code=500, detail="Internal server error. Failed to parse data.")


###


@app.post("/generate/high", response_model=SampleResponse)
async def generate_high(request: RequestModel, user_info: dict = Depends(verify_token)):
    user_level = user_info.get("inferred_level")

    if user_level != "high":
        raise HTTPException(status_code=403, detail="User does not have access to 'high' level")

    try:
        file_path = get_file_path_by_level("high", request.keyword)
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        if normalize(request.keyword) != normalize(data.get("keyword", "")):
            logger.error(f"Keyword mismatch: expected {data.get('keyword')}, got {request.keyword}")
            raise HTTPException(status_code=400, detail="Invalid keyword provided.")

        response_data = SampleResponse(
            keyword=request.keyword,
            level=user_level,
            generation0=Generation(**data.get("generation0")),
            generation1=Generation(**data.get("generation1")),
            generation2=Generation(**data.get("generation2"))
        )

        return response_data

    except ValueError as ve:
        logger.error(str(ve))
        raise HTTPException(status_code=400, detail=str(ve))
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        raise HTTPException(status_code=500, detail="Internal server error. Data file missing.")
    except json.JSONDecodeError:
        logger.error("Error decoding JSON data.")
        raise HTTPException(status_code=500, detail="Internal server error. Failed to parse data.")