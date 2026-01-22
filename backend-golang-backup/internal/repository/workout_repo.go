package repository

import (
	"context"
	"evergain-backend/internal/database"
	"evergain-backend/internal/models"
	"log"
)

type WorkoutRepository interface {
	CreateWorkout(ctx context.Context, workout *models.Workout) error
	GetRecentWorkouts(ctx context.Context, limit int) ([]models.Workout, error)
}

type workoutRepository struct{}

func NewWorkoutRepository() WorkoutRepository {
	return &workoutRepository{}
}

func (r *workoutRepository) CreateWorkout(ctx context.Context, workout *models.Workout) error {
	query := `
		INSERT INTO workouts (weight, reps, sets, feeling, progress_state, advice, color, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
		RETURNING id, created_at
	`
	err := database.DB.QueryRow(ctx, query,
		workout.Weight, workout.Reps, workout.Sets, workout.Feeling,
		workout.ProgressState, workout.Advice, workout.Color,
	).Scan(&workout.ID, &workout.CreatedAt)

	if err != nil {
		log.Printf("Error creating workout: %v", err)
		return err
	}
	return nil
}

func (r *workoutRepository) GetRecentWorkouts(ctx context.Context, limit int) ([]models.Workout, error) {
	query := `SELECT id, weight, reps, sets, feeling, progress_state, advice, color, created_at FROM workouts ORDER BY created_at DESC LIMIT $1`
	rows, err := database.DB.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var workouts []models.Workout
	for rows.Next() {
		var w models.Workout
		if err := rows.Scan(&w.ID, &w.Weight, &w.Reps, &w.Sets, &w.Feeling, &w.ProgressState, &w.Advice, &w.Color, &w.CreatedAt); err != nil {
			return nil, err
		}
		workouts = append(workouts, w)
	}
	return workouts, nil
}
