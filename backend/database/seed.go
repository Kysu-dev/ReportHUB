package database

import (
	"database/sql"
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func SeedAdmin() {
	adminName := os.Getenv("ADMIN_NAME")
	if adminName == "" {
		adminName = "Admin"
	}

	adminEmail := os.Getenv("ADMIN_EMAIL")
	if adminEmail == "" {
		adminEmail = "admin@gmail.com"
	}

	adminPassword := os.Getenv("ADMIN_PASSWORD")
	if adminPassword == "" {
		adminPassword = "admin123"
	}

	var existingID int
	err := DB.QueryRow("SELECT id FROM users WHERE email = ?", adminEmail).Scan(&existingID)
	if err == nil {
		log.Println("Admin seed already exists")
		return
	}
	if err != nil && err != sql.ErrNoRows {
		log.Println("Failed to check admin seed:", err)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Failed to hash admin password:", err)
		return
	}

	_, err = DB.Exec(`
		INSERT INTO users (name, email, password, phone, role)
		VALUES (?, ?, ?, ?, ?)
	`, adminName, adminEmail, string(hashedPassword), "", "admin")
	if err != nil {
		log.Println("Failed to seed admin:", err)
		return
	}

	log.Println("Admin seed created:", adminEmail)
}
