package handlers

import (
	"infraalert-backend/database"
	"infraalert-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetDashboardStats(c *gin.Context) {
	role := c.GetString("user_role")
	userIDVal, exists := c.Get("user_id")

	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "User not authenticated")
		return
	}

	userID := int(userIDVal.(float64))

	var totalReports, pending, inProgress, resolved int
	var err error

	if role == "admin" {
		err = database.DB.QueryRow(`
			SELECT 
				COUNT(*),
				COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0),
				COALESCE(SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END), 0),
				COALESCE(SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END), 0)
			FROM reports
		`).Scan(&totalReports, &pending, &inProgress, &resolved)
	} else {
		err = database.DB.QueryRow(`
			SELECT 
				COUNT(*),
				COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0),
				COALESCE(SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END), 0),
				COALESCE(SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END), 0)
			FROM reports WHERE user_id = ?
		`, userID).Scan(&totalReports, &pending, &inProgress, &resolved)
	}

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch stats: "+err.Error())
		return
	}

	stats := gin.H{
		"total_reports": totalReports,
		"pending":       pending,
		"in_progress":   inProgress,
		"resolved":      resolved,
	}

	utils.SuccessResponse(c, "Dashboard stats", stats)
}
