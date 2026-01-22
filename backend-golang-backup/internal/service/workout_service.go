package service

import (
	"context"
	"evergain-backend/internal/models"
	"evergain-backend/internal/repository"
)

type WorkoutService interface {
	SubmitWorkout(ctx context.Context, workout *models.Workout) (*models.Workout, error)
	GetHistory(ctx context.Context) ([]models.Workout, error)
}

type workoutService struct {
	repo      repository.WorkoutRepository
	aiService AIService
}

func NewWorkoutService(repo repository.WorkoutRepository, aiService AIService) WorkoutService {
	return &workoutService{
		repo:      repo,
		aiService: aiService,
	}
}

func (s *workoutService) SubmitWorkout(ctx context.Context, workout *models.Workout) (*models.Workout, error) {
	// 1. Get History for context
	history, err := s.repo.GetRecentWorkouts(ctx, 5)
	if err != nil {
		return nil, err
	}

	// 2. AI Analysis
	aiResp, err := s.aiService.AnalyzeWorkout(ctx, *workout, history)
	if err == nil && aiResp != nil {
		workout.Advice = aiResp.Advice
		workout.Color = aiResp.Color
		workout.ProgressState = aiResp.Status
	} else {
		// Fallback if AI fails
		workout.Advice = "Recorded. Keep pushing!"
		workout.Color = "#E0E0E0" // Default Off-White
		workout.ProgressState = "unknown"
	}

	// 3. Save to DB
	if err := s.repo.CreateWorkout(ctx, workout); err != nil {
		return nil, err
	}

	return workout, nil
}

func (s *workoutService) GetHistory(ctx context.Context) ([]models.Workout, error) {
	return s.repo.GetRecentWorkouts(ctx, 20)
}
