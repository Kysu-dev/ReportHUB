package handlers

import (
	"database/sql"
	"infraalert-backend/database"
	"infraalert-backend/models"
	"infraalert-backend/utils"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body: "+err.Error())
		return
	}

	// VALIDASI: Cek email sudah ada atau belum
	var existingID int
	checkErr := database.DB.QueryRow("SELECT id FROM users WHERE email = ?", req.Email).Scan(&existingID)

	if checkErr == nil {
		// Email sudah ada
		utils.ErrorResponse(c, http.StatusConflict, "Email already registered")
		return
	}

	if checkErr != sql.ErrNoRows {
		// Error database selain "no rows"
		utils.ErrorResponse(c, http.StatusInternalServerError, "Database error: "+checkErr.Error())
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	role := "citizen"

	// Insert user
	result, err := database.DB.Exec(`
		INSERT INTO users (name, email, password, phone, role)
		VALUES (?, ?, ?, ?, ?)
	`, req.Name, req.Email, string(hashedPassword), req.Phone, role)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create user: "+err.Error())
		return
	}

	userID, _ := result.LastInsertId()

	var user models.User
	err = database.DB.QueryRow(`
		SELECT id, uuid, name, email, phone, role, created_at
		FROM users WHERE id = ?
	`, userID).Scan(
		&user.ID, &user.UUID, &user.Name, &user.Email, &user.Phone, &user.Role, &user.CreatedAt,
	)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch user: "+err.Error())
		return
	}

	// Generate token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	// KIRIM RESPONSE SUKSES
	utils.SuccessResponse(c, "Registration successful", gin.H{
		"user":  user,
		"token": tokenString,
	})
}

func Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	var user models.User
	var hashedPassword string
	err := database.DB.QueryRow(`
		SELECT id, uuid, name, email, password, phone, role, created_at
		FROM users WHERE email = ?
	`, req.Email).Scan(
		&user.ID, &user.UUID, &user.Name, &user.Email, &hashedPassword, &user.Phone, &user.Role, &user.CreatedAt,
	)

	if err == sql.ErrNoRows {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid email or password")
		return
	}
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Database error")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password)); err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	user.Password = ""
	utils.SuccessResponse(c, "Login successful", gin.H{
		"user":  user,
		"token": tokenString,
	})
}
