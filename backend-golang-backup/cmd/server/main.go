package main

import (
	"log"
	"net/http"

	"evergain-backend/internal/config"
	"evergain-backend/internal/database"
	"evergain-backend/internal/handler"
	"evergain-backend/internal/repository"
	"evergain-backend/internal/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	// Load Config
	cfg := config.LoadConfig()

	// Connect Database
	database.ConnectDB(cfg.DatabaseURL)
	defer database.CloseDB()

	// Initialize Layers
	workoutRepo := repository.NewWorkoutRepository()
	userRepo := repository.NewUserRepository()

	aiService := service.NewAIService(cfg)
	workoutService := service.NewWorkoutService(workoutRepo, aiService)
	authService := service.NewAuthService(userRepo)

	workoutHandler := handler.NewWorkoutHandler(workoutService)
	authHandler := handler.NewAuthHandler(authService)

	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Routes
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("EverGain Backend is running!"))
	})

	r.Route("/api/workouts", func(r chi.Router) {
		r.Post("/", workoutHandler.SubmitWorkout)
		r.Get("/", workoutHandler.GetHistory)
	})

	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)
	})

	log.Printf("Server starting on port %s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
