package handlers

import (
	"database/sql"
	"fmt"
	"infraalert-backend/database"
	"infraalert-backend/models"
	"infraalert-backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func generateReportID() string {
	return fmt.Sprintf("IA-%03d", time.Now().UnixNano()%1000+1)
}

func CreateReport(c *gin.Context) {
	userIDVal, _ := c.Get("user_id")
	userID := int(userIDVal.(float64))

	var req struct {
		Type        string `json:"type"`
		Severity    string `json:"severity"`
		Location    string `json:"location"`
		Description string `json:"description"`
		ImageURL    string `json:"image_url"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request body: "+err.Error())
		return
	}

	if req.Type == "" || req.Location == "" {
		utils.ErrorResponse(c, http.StatusBadRequest, "Type and location are required")
		return
	}
	if req.Severity == "" {
		req.Severity = "medium"
	}

	reportID := generateReportID()

	result, err := database.DB.Exec(`
		INSERT INTO reports (report_id, user_id, type, severity, location, description, image_url)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, reportID, userID, req.Type, req.Severity, req.Location, req.Description, req.ImageURL)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create report: "+err.Error())
		return
	}

	reportDBID, err := result.LastInsertId()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to get report ID")
		return
	}

	_, err = database.DB.Exec(`
		INSERT INTO report_timelines (report_id, status, notes)
		VALUES (?, ?, ?)
	`, reportDBID, "pending", "Report submitted")

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create timeline: "+err.Error())
		return
	}

	var report models.Report
	err = database.DB.QueryRow(`
		SELECT id, report_id, user_id, type, severity, status, location, description, image_url, created_at
		FROM reports WHERE id = ?
	`, reportDBID).Scan(
		&report.ID, &report.ReportID, &report.UserID, &report.Type, &report.Severity, &report.Status,
		&report.Location, &report.Description, &report.ImageURL, &report.CreatedAt,
	)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch created report")
		return
	}

	utils.SuccessResponse(c, "Report created successfully", report)
}

func GetReports(c *gin.Context) {
	role := c.GetString("user_role")
	userIDVal, _ := c.Get("user_id")

	var rows *sql.Rows
	var err error

	if role == "admin" {
		rows, err = database.DB.Query(`
			SELECT id, report_id, user_id, type, severity, status, location, description, image_url, created_at
			FROM reports ORDER BY created_at DESC
		`)
	} else {
		userID := int(userIDVal.(float64))
		rows, err = database.DB.Query(`
			SELECT id, report_id, user_id, type, severity, status, location, description, image_url, created_at
			FROM reports WHERE user_id = ? ORDER BY created_at DESC
		`, userID)
	}

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch reports")
		return
	}
	defer rows.Close()

	var reports []models.Report
	for rows.Next() {
		var report models.Report
		err := rows.Scan(
			&report.ID, &report.ReportID, &report.UserID, &report.Type, &report.Severity,
			&report.Status, &report.Location, &report.Description, &report.ImageURL, &report.CreatedAt,
		)
		if err != nil {
			continue
		}
		reports = append(reports, report)
	}

	utils.SuccessResponse(c, "Reports fetched", reports)
}

func GetReportByID(c *gin.Context) {
	reportID := c.Param("id")
	role := c.GetString("user_role")
	userIDVal, _ := c.Get("user_id")

	var report models.Report
	var reportDBID int
	var reportUserID int

	var err error

	if role != "admin" {
		userID := int(userIDVal.(float64))
		err = database.DB.QueryRow(`
			SELECT id, report_id, user_id, type, severity, status, location, description, image_url, created_at
			FROM reports WHERE report_id = ? AND user_id = ?
		`, reportID, userID).Scan(
			&reportDBID, &report.ReportID, &reportUserID, &report.Type, &report.Severity,
			&report.Status, &report.Location, &report.Description, &report.ImageURL, &report.CreatedAt,
		)
	} else {
		err = database.DB.QueryRow(`
			SELECT id, report_id, user_id, type, severity, status, location, description, image_url, created_at
			FROM reports WHERE report_id = ?
		`, reportID).Scan(
			&reportDBID, &report.ReportID, &reportUserID, &report.Type, &report.Severity,
			&report.Status, &report.Location, &report.Description, &report.ImageURL, &report.CreatedAt,
		)
	}

	if err == sql.ErrNoRows {
		utils.ErrorResponse(c, http.StatusNotFound, "Report not found")
		return
	}
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Database error: "+err.Error())
		return
	}

	report.ID = reportDBID
	report.UserID = reportUserID

	rows, err := database.DB.Query(`
		SELECT id, report_id, status,
			COALESCE(notes, ''),
			COALESCE(assigned_to, ''),
			created_at
		FROM report_timelines WHERE report_id = ? ORDER BY created_at ASC
	`, reportDBID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch timeline: "+err.Error())
		return
	}
	defer rows.Close()

	var timeline []models.ReportTimeline
	for rows.Next() {
		var t models.ReportTimeline
		var timelineReportID int
		err := rows.Scan(&t.ID, &timelineReportID, &t.Status, &t.Notes, &t.AssignedTo, &t.CreatedAt)
		if err != nil {
			continue
		}
		t.ReportID = timelineReportID
		timeline = append(timeline, t)
	}

	utils.SuccessResponse(c, "Report fetched", gin.H{
		"report":   report,
		"timeline": timeline,
	})
}

func UpdateReportStatus(c *gin.Context) {
	reportID := c.Param("id")

	var req models.UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid request")
		return
	}

	var reportDBID int
	err := database.DB.QueryRow(`SELECT id FROM reports WHERE report_id = ?`, reportID).Scan(&reportDBID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Report not found")
		return
	}

	_, err = database.DB.Exec(`UPDATE reports SET status = ? WHERE report_id = ?`, req.Status, reportID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update status")
		return
	}

	_, err = database.DB.Exec(`
		INSERT INTO report_timelines (report_id, status, notes, assigned_to)
		VALUES (?, ?, ?, ?)
	`, reportDBID, req.Status, req.Notes, req.AssignedTo)

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to add timeline entry")
		return
	}

	utils.SuccessResponse(c, "Status updated successfully", nil)
}

func DeleteReport(c *gin.Context) {
	reportID := c.Param("id")
	role := c.GetString("user_role")

	var result sql.Result
	var err error

	if role == "admin" {
		result, err = database.DB.Exec(`DELETE FROM reports WHERE report_id = ?`, reportID)
	} else {
		userIDVal, _ := c.Get("user_id")
		userID := int(userIDVal.(float64))
		result, err = database.DB.Exec(`DELETE FROM reports WHERE report_id = ? AND user_id = ?`, reportID, userID)
	}

	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete report")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		utils.ErrorResponse(c, http.StatusNotFound, "Report not found or unauthorized")
		return
	}

	utils.SuccessResponse(c, "Report deleted successfully", nil)
}