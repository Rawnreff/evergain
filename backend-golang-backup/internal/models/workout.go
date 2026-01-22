package models

import "time"

type Workout struct {
	ID            int       `json:"id"`
	Weight        float64   `json:"weight"`
	Reps          int       `json:"reps"`
	Sets          int       `json:"sets"`
	Feeling       string    `json:"feeling"`
	ProgressState string    `json:"progress_state"` // up, stagnant, down
	Advice        string    `json:"advice"`
	Color         string    `json:"color"`
	CreatedAt     time.Time `json:"created_at"`
}

type AIResponse struct {
	Status string `json:"status"` // "progress_up", "stagnant", "unsafe"
	Advice string `json:"advice"`
	Color  string `json:"color"`
	Risk   string `json:"risk"`
}
