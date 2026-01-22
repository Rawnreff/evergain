package service

import (
	"errors"
	"evergain-backend/internal/models"
	"evergain-backend/internal/repository"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo *repository.UserRepository
}

// Secret key should be loaded from env in production
var jwtSecret = []byte("SUPER_SECRET_KEY_FOR_EVERGAIN")

func NewAuthService(repo *repository.UserRepository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) Register(req models.RegisterRequest) (*models.AuthResponse, error) {
	// Check if user exists
	existing, _ := s.repo.GetUserByEmail(req.Email)
	if existing != nil {
		return nil, errors.New("email already registered")
	}

	// Hash password
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	newUser := &models.User{
		FullName:     req.FullName,
		Email:        req.Email,
		PasswordHash: string(hashedPwd),
	}

	if err := s.repo.CreateUser(newUser); err != nil {
		return nil, err
	}

	// Generate Token
	token, err := s.generateToken(newUser.ID)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{Token: token, User: *newUser}, nil
}

func (s *AuthService) Login(req models.LoginRequest) (*models.AuthResponse, error) {
	user, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Generate Token
	token, err := s.generateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{Token: token, User: *user}, nil
}

func (s *AuthService) generateToken(userID int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
