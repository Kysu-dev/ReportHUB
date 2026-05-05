package models

import "time"

type Report struct {
	ID          int       `json:"id"`
	ReportID    string    `json:"report_id"`
	UserID      int       `json:"user_id"`
	Type        string    `json:"type"`
	Severity    string    `json:"severity"`
	Status      string    `json:"status"`
	Location    string    `json:"location"`
	Description string    `json:"description"`
	ImageURL    string    `json:"image_url"`
	CreatedAt   time.Time `json:"created_at"`
}

type ReportTimeline struct {
	ID         int       `json:"id"`
	ReportID   int       `json:"report_id"`
	Status     string    `json:"status"`
	Notes      string    `json:"notes"`
	AssignedTo string    `json:"assigned_to"`
	CreatedAt  time.Time `json:"created_at"`
}

type CreateReportRequest struct {
	Type        string `json:"type" binding:"required"`
	Severity    string `json:"severity"`
	Location    string `json:"location" binding:"required"`
	Description string `json:"description"`
}

type UpdateStatusRequest struct {
	Status     string `json:"status" binding:"required"`
	Notes      string `json:"notes"`
	AssignedTo string `json:"assigned_to"`
}