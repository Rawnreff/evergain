package repository

import (
	"context"
	"errors"
	"evergain-backend/internal/database"
	"evergain-backend/internal/models"

	"github.com/jackc/pgx/v5"
)

type UserRepository struct{}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (r *UserRepository) CreateUser(user *models.User) error {
	query := `INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, created_at`
	err := database.DB.QueryRow(context.Background(), query, user.FullName, user.Email, user.PasswordHash).Scan(&user.ID, &user.CreatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	query := `SELECT id, full_name, email, password_hash, created_at FROM users WHERE email = $1`
	err := database.DB.QueryRow(context.Background(), query, email).Scan(&user.ID, &user.FullName, &user.Email, &user.PasswordHash, &user.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}
