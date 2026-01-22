import google.generativeai as genai
from config import Config
from models.workout import AIResponse
import json
import logging

logger = logging.getLogger(__name__)

class AIService:
    """Google Gemini AI integration for workout analysis"""
    
    def __init__(self):
        """Initialize Gemini AI client"""
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def analyze_workout(self, current_workout, history):
        """
        Analyze workout progress using AI
        
        Args:
            current_workout: Current workout object
            history: List of recent workout objects
        
        Returns:
            AIResponse object with status, advice, color, and risk
        """
        try:
            # Build history string
            history_str = ""
            for workout in history:
                history_str += f"- Date: {workout.created_at.strftime('%Y-%m-%d')}, "
                history_str += f"Weight: {workout.weight}kg, "
                history_str += f"Reps: {workout.reps}, "
                history_str += f"Sets: {workout.sets}, "
                history_str += f"Feeling: {workout.feeling}\n"
            
            # Construct prompt
            prompt = f"""
You are EverGain AI, a smart fitness coach.
Analyze the user's latest workout and compare it with history.

**Context (Color System - Smart Growth Noir):**
- **Lime Green (#C6FF5E)**: Progress Up / Success / Good Overload.
- **Electric Blue (#00D1FF)**: Stagnant / Maintenance / Needs Optimization.
- **Red (#FF5E5E)**: Unsafe / Ego Lifting / Injury Risk / Performance Drop.

**User History (Last 5 sessions):**
{history_str}

**Current Session:**
- Weight: {current_workout.weight}kg
- Reps: {current_workout.reps}
- Sets: {current_workout.sets}
- Feeling: {current_workout.feeling}

**Task:**
Analyze the progress. Is it up, stagnant, or down?
Provide brief, punchy advice (max 2 sentences).
Assign the correct hex color based on the status.
Assess risk (Safe / Caution / High Risk).

**Output JSON ONLY:**
{{
  "status": "progress_up" | "stagnant" | "unsafe" | "down",
  "advice": "...",
  "color": "#HEX",
  "risk": "..."
}}
"""
            
            # Generate AI response
            response = self.model.generate_content(prompt)
            
            if not response or not response.text:
                return self._fallback_response()
            
            # Parse JSON response
            json_str = response.text.strip()
            # Clean markdown code blocks if present
            json_str = json_str.replace('```json', '').replace('```', '').strip()
            
            ai_data = json.loads(json_str)
            
            return AIResponse(
                status=ai_data.get('status', 'stagnant'),
                advice=ai_data.get('advice', 'Good effort. Keep tracking your progress.'),
                color=ai_data.get('color', '#00D1FF'),
                risk=ai_data.get('risk', 'Safe')
            )
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI JSON response: {e}")
            return self._fallback_response()
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            return self._fallback_response()
    
    def _fallback_response(self):
        """Fallback response when AI fails"""
        return AIResponse(
            status='stagnant',
            advice='Good effort. Analyze trends for next time.',
            color='#00D1FF',
            risk='Safe'
        )
