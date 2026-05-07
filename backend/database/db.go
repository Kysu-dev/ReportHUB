package database

import (
	"database/sql"
	"fmt"
	"infraalert-backend/config"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	config.LoadConfig()

	// First connect without database name to create it if needed
	dbName := config.AppConfig.DBName
	if dbName == "" {
		dbName = "infraalert"
	}

	connStr := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local",
		config.AppConfig.DBUser,
		config.AppConfig.DBPassword,
		config.AppConfig.DBHost,
		config.AppConfig.DBPort,
	)

	var err error
	DB, err = sql.Open("mysql", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Database ping failed:", err)
	}

	// Create database if not exists
	_, err = DB.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s`", dbName))
	if err != nil {
		log.Fatal("Failed to create database:", err)
	}

	// Close initial connection
	DB.Close()

	// Connect to the specific database
	connStrWithDB := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.AppConfig.DBUser,
		config.AppConfig.DBPassword,
		config.AppConfig.DBHost,
		config.AppConfig.DBPort,
		dbName,
	)

	DB, err = sql.Open("mysql", connStrWithDB)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Database ping failed:", err)
	}

	log.Println("Database connected successfully")
	CreateTables()
}

func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}

func CreateTables() {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id INT AUTO_INCREMENT PRIMARY KEY,
			uuid VARCHAR(36) DEFAULT (UUID()),
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			phone VARCHAR(20),
			role VARCHAR(20) DEFAULT 'citizen',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS reports (
			id INT AUTO_INCREMENT PRIMARY KEY,
			report_id VARCHAR(20) UNIQUE NOT NULL,
			user_id INT,
			type VARCHAR(50) NOT NULL,
			severity VARCHAR(20) DEFAULT 'medium',
			status VARCHAR(20) DEFAULT 'pending',
			location VARCHAR(255) NOT NULL,
			latitude DECIMAL(10,8),
			longitude DECIMAL(11,8),
			description TEXT,
			image_url TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		)`,

		`CREATE TABLE IF NOT EXISTS report_timelines (
			id INT AUTO_INCREMENT PRIMARY KEY,
			report_id INT,
			status VARCHAR(20) NOT NULL,
			notes TEXT,
			assigned_to VARCHAR(100),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
		)`,
	}

	for _, query := range queries {
		if _, err := DB.Exec(query); err != nil {
			log.Println("Error creating table:", err)
		}
	}
	log.Println("Tables ready")
}