CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    weight FLOAT NOT NULL,
    reps INT NOT NULL,
    sets INT NOT NULL,
    feeling TEXT,
    progress_state VARCHAR(50),
    advice TEXT,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
