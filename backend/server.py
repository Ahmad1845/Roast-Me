from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import openai
import time
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# OpenAI configuration
openai.api_key = os.environ['OPENAI_API_KEY']

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class RoastRequest(BaseModel):
    name: str
    age: str
    appearance: Optional[str] = ""
    hobbies: Optional[str] = ""
    personality: Optional[str] = ""
    occupation: Optional[str] = ""
    embarrassing_fact: Optional[str] = ""
    roast_intensity: str = "medium"

class RoastResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    roast: str
    intensity: str
    user_data: dict
    created_at: datetime = Field(default_factory=datetime.utcnow)
    processing_time: float

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# OpenAI Roast Generation
async def generate_roast(user_data: RoastRequest) -> str:
    """Generate a personalized roast using OpenAI."""
    
    intensity_prompts = {
        "light": """
        Create a gentle, playful roast that's funny but not mean. Think friendly teasing between friends.
        Keep it lighthearted and wholesome. Focus on quirky observations rather than harsh criticism.
        """,
        "medium": """
        Create a standard roast with clever observations and witty burns. Be sarcastic and humorous
        but maintain a playful tone. This should feel like a comedy roast - funny but not cruel.
        """,
        "savage": """
        Create a savage roast that pulls no punches. Be brutally honest and hilariously harsh.
        Use sharp wit and clever wordplay. Make it devastating but still entertaining and creative.
        Don't cross into genuinely hurtful territory - keep it playfully savage.
        """
    }
    
    # Build the user information for the prompt
    user_info = f"Name: {user_data.name}, Age: {user_data.age}"
    if user_data.occupation:
        user_info += f", Occupation: {user_data.occupation}"
    if user_data.appearance:
        user_info += f", Appearance: {user_data.appearance}"
    if user_data.hobbies:
        user_info += f", Hobbies: {user_data.hobbies}"
    if user_data.personality:
        user_info += f", Personality: {user_data.personality}"
    if user_data.embarrassing_fact:
        user_info += f", Embarrassing fact: {user_data.embarrassing_fact}"
    
    system_prompt = f"""
    You are a witty AI comedian specializing in roasts. Your job is to create personalized, 
    hilarious roasts based on the information provided about a person.
    
    {intensity_prompts[user_data.roast_intensity]}
    
    Rules:
    - Generate exactly 6-10 lines of roast content
    - Each line should be a separate witty observation or burn
    - Use the person's actual details to make it personalized
    - Be creative and original - avoid clichés
    - Keep it entertaining and fun, never genuinely mean or offensive
    - Separate each line with a newline character
    - Don't include greetings or conclusions, just pure roast content
    """
    
    user_prompt = f"""
    Roast this person based on their information:
    {user_info}
    
    Roast intensity level: {user_data.roast_intensity}
    """
    
    try:
        response = await asyncio.to_thread(
            openai.chat.completions.create,
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=500,
            temperature=0.9,
            presence_penalty=0.6,
            frequency_penalty=0.6
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        logging.error(f"OpenAI API error: {e}")
        
        # Enhanced fallback roasts based on user data
        fallback_roasts = {
            "light": f"Hey {user_data.name}, at {user_data.age} years old, you're like a fine wine... if wine could somehow get more questionable with age! {f'Your {user_data.occupation} career' if user_data.occupation else 'Your life choices'} suggest you're really committed to... well, let's call it 'creative problem-solving.' {f'And {user_data.embarrassing_fact}?' if user_data.embarrassing_fact else ''} Classic you! But hey, at least you're brave enough to ask an AI to roast you - that takes a special kind of confidence!",
            
            "medium": f"Well well, {user_data.name}, {user_data.age} years on this planet and this is what you've accomplished? {f'Working as a {user_data.occupation}' if user_data.occupation else 'Your career path'} really screams 'I peaked in high school,' doesn't it? {f'Your hobbies include {user_data.hobbies}' if user_data.hobbies else 'Your free time activities'} - because nothing says 'I have my life together' like that combination. {f'And let us not forget {user_data.embarrassing_fact}' if user_data.embarrassing_fact else 'Your track record'} - truly the stuff of legends! But I admire the audacity of asking an AI to hurt your feelings. That takes real commitment to self-destruction!",
            
            "savage": f"Oh {user_data.name}, where do I even begin with this beautiful disaster? At {user_data.age}, most people have figured out basic adulting, but you... you chose a different path, didn't you? {f'Being a {user_data.occupation}' if user_data.occupation else 'Your career choices'} is like watching someone try to solve a Rubik's cube with their feet - technically possible, but painful for everyone involved. {f'Your personality traits of {user_data.personality}' if user_data.personality else 'Your whole vibe'} scream 'I was the kid who reminded the teacher about homework.' {f'And {user_data.embarrassing_fact}?' if user_data.embarrassing_fact else 'Your life story?'} That's not embarrassing, that's a masterclass in questionable decision-making! The fact that you voluntarily signed up to get digitally destroyed tells me your self-preservation instincts are about as developed as your fashion sense. But hey, at least you're consistent in your commitment to chaos!"
        }
        
        return fallback_roasts.get(user_data.roast_intensity, fallback_roasts["medium"])

# API Routes
@api_router.get("/")
async def root():
    return {"message": "AI Roast Me API - Ready to serve digital destruction! 🔥"}

@api_router.post("/roast", response_model=RoastResponse)
async def create_roast(roast_request: RoastRequest):
    """Generate a personalized AI roast."""
    start_time = time.time()
    
    try:
        # Generate the roast using OpenAI
        roast_content = await generate_roast(roast_request)
        
        processing_time = time.time() - start_time
        
        # Create response object
        roast_response = RoastResponse(
            roast=roast_content,
            intensity=roast_request.roast_intensity,
            user_data=roast_request.dict(),
            processing_time=processing_time
        )
        
        # Save to database
        roast_data = roast_response.dict()
        roast_data['roast_id'] = roast_data['id']
        await db.roasts.insert_one(roast_data)
        
        logging.info(f"Generated roast for {roast_request.name} in {processing_time:.2f}s")
        
        return roast_response
        
    except Exception as e:
        logging.error(f"Error generating roast: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate roast. Please try again!")

@api_router.get("/roast/{roast_id}")
async def get_roast(roast_id: str):
    """Retrieve a specific roast by ID."""
    roast = await db.roasts.find_one({"roast_id": roast_id})
    if not roast:
        raise HTTPException(status_code=404, detail="Roast not found")
    
    # Remove MongoDB ObjectId for JSON serialization
    roast.pop('_id', None)
    return roast

@api_router.get("/roasts/stats")
async def get_roast_stats():
    """Get statistics about roasts generated."""
    total_roasts = await db.roasts.count_documents({})
    
    # Get intensity distribution
    pipeline = [
        {"$group": {"_id": "$intensity", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    intensity_stats = await db.roasts.aggregate(pipeline).to_list(10)
    
    return {
        "total_roasts": total_roasts,
        "intensity_distribution": intensity_stats,
        "api_status": "operational"
    }

# Legacy routes for compatibility
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)