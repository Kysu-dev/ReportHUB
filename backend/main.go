package main

import (
	"infraalert-backend/database"
	"infraalert-backend/routes"
	"log"

	"github.com/gin-gonic/gin"
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

	// Ensure default admin user exists (idempotent)
	database.SeedAdmin()

	// Setup routes with Gin
	router := routes.SetupRouter()

	// CORS - allow all origins for development
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// SERVE STATIC FILES FOR UPLOADS
	router.Static("/uploads", "./uploads")

	// Run server
	log.Println("Server starting on port 8080")
	router.Run(":8080")
}