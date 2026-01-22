package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port         string
	DatabaseURL  string
	GeminiAPIKey string
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found, using defaults/environment variables")
	}

	return &Config{
		Port:         getEnv("PORT", "8080"),
		DatabaseURL:  getEnv("DATABASE_URL", "postgres://user:password@localhost:5432/evergain?sslmode=disable"),
		GeminiAPIKey: getEnv("GEMINI_API_KEY", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
