package handler

import (
	"encoding/json"
	"net/http"

	"evergain-backend/internal/models"
	"evergain-backend/internal/service"
)

type WorkoutHandler struct {
	service service.WorkoutService
}

func NewWorkoutHandler(service service.WorkoutService) *WorkoutHandler {
	return &WorkoutHandler{service: service}
}

func (h *WorkoutHandler) SubmitWorkout(w http.ResponseWriter, r *http.Request) {
	var workout models.Workout
	if err := json.NewDecoder(r.Body).Decode(&workout); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	result, err := h.service.SubmitWorkout(r.Context(), &workout)
	if err != nil {
		http.Error(w, "Processing failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (h *WorkoutHandler) GetHistory(w http.ResponseWriter, r *http.Request) {
	history, err := h.service.GetHistory(r.Context())
	if err != nil {
		http.Error(w, "Failed to fetch history", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(history)
}
