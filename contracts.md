# AI Roast Me - API Contracts & Integration Plan

## API Endpoints

### POST /api/roast
**Purpose**: Generate a personalized AI roast based on user input

**Request Body**:
```json
{
  "name": "string (required)",
  "age": "string (required)", 
  "appearance": "string (optional)",
  "hobbies": "string (optional)",
  "personality": "string (optional)",
  "occupation": "string (optional)",
  "embarrassing_fact": "string (optional)",
  "roast_intensity": "light|medium|savage (required)"
}
```

**Response**:
```json
{
  "id": "string (uuid)",
  "roast": "string (AI generated roast)",
  "intensity": "string (roast level)",
  "user_data": "object (form data for reference)",
  "created_at": "datetime",
  "processing_time": "float (seconds)"
}
```

### GET /api/roasts/{roast_id}
**Purpose**: Retrieve a specific roast by ID

**Response**: Same as POST /api/roast response

## Mock Data Replacement

**Current Mock Implementation** (`/app/frontend/src/utils/mockData.js`):
- Contains 5 pre-written roast templates
- Random selection logic
- Static intensity mapping

**Backend Integration Changes**:
- Remove `mockRoasts` array usage
- Replace `setTimeout` with actual API call
- Update error handling for real API responses
- Add loading states for network requests

## OpenAI Integration Strategy

**Model**: GPT-4 or GPT-3.5-turbo
**Prompt Engineering**:
- Dynamic prompt based on user intensity level
- Incorporate all user-provided information
- Maintain appropriate tone (funny but not cruel)
- Generate 6-10 witty lines as specified

**Intensity Levels**:
- **Light**: Gentle teasing, wholesome humor
- **Medium**: Standard roasting with clever observations  
- **Savage**: Maximum destruction (but still playful)

## Frontend Changes Required

1. **RoastApp.jsx**: Replace mock API simulation with real fetch call
2. **Error Handling**: Add proper error states for API failures
3. **Environment Variables**: Use REACT_APP_BACKEND_URL for API calls
4. **Loading States**: Keep existing loading animation

## Database Schema

**roasts collection**:
```json
{
  "_id": "ObjectId",
  "roast_id": "string (uuid)",
  "user_data": {
    "name": "string",
    "age": "string", 
    "appearance": "string",
    "hobbies": "string",
    "personality": "string",
    "occupation": "string",
    "embarrassing_fact": "string",
    "roast_intensity": "string"
  },
  "roast_content": "string",
  "intensity": "string",
  "processing_time": "float",
  "created_at": "datetime",
  "openai_model": "string",
  "prompt_tokens": "integer",
  "completion_tokens": "integer"
}
```

## Security & Rate Limiting

- API key stored securely in backend .env
- No API key exposure to frontend
- Rate limiting per IP (future enhancement)
- Input validation and sanitization
- Error message standardization

## Implementation Order

1. ✅ Frontend with mock data (COMPLETED)
2. 🔄 Backend API with OpenAI integration (NEXT)
3. 🔄 Frontend integration with real API (NEXT)  
4. 🔄 Testing and error handling (NEXT)
5. 🔄 Optional enhancements (TTS, sharing, leaderboard)