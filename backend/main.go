package main

import (
	"infraalert-backend/database"
	"infraalert-backend/routes"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env")
	}

	// Connect to database
	database.ConnectDB()
	defer database.CloseDB()

	// Setup routes with Gin
	router := routes.SetupRouter()

	// SERVE STATIC FILES FOR UPLOADS
	router.Static("/uploads", "./uploads")

	// Run server
	log.Println("Server starting on port 8080")
	router.Run(":8080")
}