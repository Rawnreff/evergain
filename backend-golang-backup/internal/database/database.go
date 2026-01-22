package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB(databaseURL string) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		log.Fatalf("Unable to parse database URL: %v", err)
	}

	config.MaxConns = 10
	config.MinConns = 2
	config.HealthCheckPeriod = 1 * time.Minute

	dbpool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v", err)
	}

	if err := dbpool.Ping(context.Background()); err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	DB = dbpool
	fmt.Println("Connected to PostgreSQL successfully!")
}

func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}
