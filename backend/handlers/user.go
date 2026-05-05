package handlers

import (
	"infraalert-backend/database"
	"infraalert-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func UpdateProfile(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int(userIDVal.(float64))

	var req struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request")
		return
	}

	_, err := database.DB.Exec(`
		UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?
	`, req.Name, req.Email, req.Phone, userID)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update profile")
		return
	}

	utils.SuccessResponse(c, "Profile updated", nil)
}

func UpdatePassword(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int(userIDVal.(float64))

	var req struct {
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request")
		return
	}

	var hashedPassword string
	err := database.DB.QueryRow("SELECT password FROM users WHERE id = ?", userID).Scan(&hashedPassword)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Database error")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.CurrentPassword)); err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Current password is incorrect")
		return
	}

	newHashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	_, err = database.DB.Exec("UPDATE users SET password = ? WHERE id = ?", string(newHashedPassword), userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update password")
		return
	}

	utils.SuccessResponse(c, "Password updated", nil)
}

func DeleteAccount(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int(userIDVal.(float64))

	_, err := database.DB.Exec("DELETE FROM users WHERE id = ?", userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete account")
		return
	}

	utils.SuccessResponse(c, "Account deleted", nil)
}

func ExportUserData(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int(userIDVal.(float64))

	var user struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
	}
	database.DB.QueryRow("SELECT name, email, phone FROM users WHERE id = ?", userID).Scan(&user.Name, &user.Email, &user.Phone)

	reports, err := database.DB.Query("SELECT report_id, type, severity, status, location, description, image_url, created_at FROM reports WHERE user_id = ?", userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch reports")
		return
	}
	defer reports.Close()

	var reportsList []map[string]interface{}
	for reports.Next() {
		var report_id, report_type, severity, status, location, description, image_url, created_at string
		reports.Scan(&report_id, &report_type, &severity, &status, &location, &description, &image_url, &created_at)
		reportsList = append(reportsList, map[string]interface{}{
			"report_id":   report_id,
			"type":        report_type,
			"severity":    severity,
			"status":      status,
			"location":    location,
			"description": description,
			"image_url":   image_url,
			"created_at":  created_at,
		})
	}

	exportData := map[string]interface{}{
		"user":    user,
		"reports": reportsList,
	}

	utils.SuccessResponse(c, "Data exported", exportData)
}