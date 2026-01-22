package service

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"evergain-backend/internal/config"
	"evergain-backend/internal/models"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type AIService interface {
	AnalyzeWorkout(ctx context.Context, current models.Workout, history []models.Workout) (*models.AIResponse, error)
}

type aiService struct {
	client *genai.Client
	model  *genai.GenerativeModel
}

func NewAIService(cfg *config.Config) AIService {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(cfg.GeminiAPIKey))
	if err != nil {
		log.Fatalf("Failed to create Gemini client: %v", err)
	}

	model := client.GenerativeModel("gemini-pro") // Or gemini-1.5-flash if available
	return &aiService{client: client, model: model}
}

func (s *aiService) AnalyzeWorkout(ctx context.Context, current models.Workout, history []models.Workout) (*models.AIResponse, error) {
	// Construct Prompt
	historyStr := ""
	for _, w := range history {
		historyStr += fmt.Sprintf("- Date: %s, Weight: %.1fkg, Reps: %d, Sets: %d, Feeling: %s\n", w.CreatedAt.Format("2006-01-02"), w.Weight, w.Reps, w.Sets, w.Feeling)
	}

	prompt := fmt.Sprintf(`
You are EverGain AI, a smart fitness coach.
Analyze the user's latest workout and compare it with history.

**Context (Color System - Smart Growth Noir):**
- **Lime Green (#C6FF5E)**: Progress Up / Success / Good Overload.
- **Electric Blue (#00D1FF)**: Stagnant / Maintenance / Needs Optimization.
- **Red (#FF5E5E)**: Unsafe / Ego Lifting / Injury Risk / Performance Drop.

**User History (Last 5 sessions):**
%s

**Current Session:**
- Weight: %.1fkg
- Reps: %d
- Sets: %d
- Feeling: %s

**Task:**
Analyze the progress. Is it up, stagnant, or down?
Provide brief, punchy advice (max 2 sentences).
Assign the correct hex color based on the status.
Assess risk (Safe / Caution / High Risk).

**Output JSON ONLY:**
{
  "status": "progress_up" | "stagnant" | "unsafe" | "down",
  "advice": "...",
  "color": "#HEX",
  "risk": "..."
}
`, historyStr, current.Weight, current.Reps, current.Sets, current.Feeling)

	resp, err := s.model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, err
	}

	if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
		return nil, fmt.Errorf("no response from AI")
	}

	part := resp.Candidates[0].Content.Parts[0]
	text, ok := part.(genai.Text)
	if !ok {
		return nil, fmt.Errorf("unexpected response format")
	}

	// Clean code blocks if present
	jsonStr := string(text)
	jsonStr = strings.TrimPrefix(jsonStr, "```json")
	jsonStr = strings.TrimPrefix(jsonStr, "```")
	jsonStr = strings.TrimSpace(jsonStr)

	var aiResp models.AIResponse
	if err := json.Unmarshal([]byte(jsonStr), &aiResp); err != nil {
		log.Printf("Failed to parse AI JSON: %v. Raw: %s", err, jsonStr)
		// Fallback
		return &models.AIResponse{
			Status: "stagnant",
			Advice: "Good effort. Analyze trends for next time.",
			Color:  "#00D1FF",
			Risk:   "Safe",
		}, nil
	}

	return &aiResp, nil
}
