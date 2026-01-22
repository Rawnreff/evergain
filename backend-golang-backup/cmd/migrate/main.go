package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"evergain-backend/internal/config"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	// 1. Load Config to get credentials
	cfg := config.LoadConfig()

	// Parse the existing connection string to extract user/pass/host
	// Default: postgres://user:password@localhost:5432/evergain?sslmode=disable
	// We need to connect to 'postgres' db first to create 'evergain'
	baseDSN := strings.Replace(cfg.DatabaseURL, "/evergain", "/postgres", 1)

	fmt.Println("Connecting to default 'postgres' database to check/create 'evergain'...")
	// Connect to default 'postgres' db
	db, err := sql.Open("pgx", baseDSN)
	if err != nil {
		log.Fatalf("Failed to connect to postgres: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping postgres. check your credentials in .env: %v", err)
	}

	// 2. Create Database if not exists
	// Note: parameter binding doesn't work for CREATE DATABASE identifiers
	checkDB := "SELECT 1 FROM pg_database WHERE datname = 'evergain'"
	var exists int
	err = db.QueryRow(checkDB).Scan(&exists)
	if err == sql.ErrNoRows {
		fmt.Println("Database 'evergain' does not exist. Creating...")
		if _, err := db.Exec("CREATE DATABASE evergain"); err != nil {
			log.Fatalf("Failed to create database: %v", err)
		}
		fmt.Println("Database 'evergain' created successfully.")
	} else if err != nil {
		log.Fatalf("Error checking database existence: %v", err)
	} else {
		fmt.Println("Database 'evergain' already exists.")
	}

	// 3. Connect to the new 'evergain' database
	fmt.Println("Connecting to 'evergain' database to apply schema...")
	evergainDB, err := sql.Open("pgx", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to evergain db: %v", err)
	}
	defer evergainDB.Close()

	// 4. Read and Execute Schema
	schemaBytes, err := os.ReadFile("scripts/schema.sql")
	if err != nil {
		// Try absolute path or relative to backend root
		schemaBytes, err = os.ReadFile("backend/scripts/schema.sql")
		if err != nil {
			// Try one more relative path just in case run from inside cmd/server
			schemaBytes, err = os.ReadFile("../../scripts/schema.sql")
			if err != nil {
				log.Fatalf("Failed to read schema.sql: %v", err)
			}
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if _, err := evergainDB.ExecContext(ctx, string(schemaBytes)); err != nil {
		log.Fatalf("Failed to execute schema: %v", err)
	}

	fmt.Println("✅ Schema applied successfully! Table 'workouts' is ready.")
}
