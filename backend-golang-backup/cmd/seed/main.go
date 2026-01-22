package main

import (
	"context"
	"fmt"
	"log"

	"evergain-backend/internal/config"
	"evergain-backend/internal/database"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	// 1. Load Config
	cfg := config.LoadConfig()

	// 2. Connect Database
	database.ConnectDB(cfg.DatabaseURL)
	defer database.CloseDB()

	// 3. User Details
	email := "admin@evergain.com"
	password := "password123"
	fullName := "Admin EverGain"

	// 4. Check if user exists
	var exists bool
	queryCheck := `SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)`
	err := database.DB.QueryRow(context.Background(), queryCheck, email).Scan(&exists)
	if err != nil {
		log.Fatalf("Failed to check user existence: %v", err)
	}

	if exists {
		fmt.Println("User 'admin@evergain.com' already exists.")
		return
	}

	// 5. Create User
	fmt.Println("Creating default user...")
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	queryInsert := `INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3)`
	_, err = database.DB.Exec(context.Background(), queryInsert, fullName, email, string(hashedPwd))
	if err != nil {
		log.Fatalf("Failed to insert user: %v", err)
	}

	fmt.Println("✅ Default user created successfully!")
	fmt.Println("Email: admin@evergain.com")
	fmt.Println("Password: password123")
}
