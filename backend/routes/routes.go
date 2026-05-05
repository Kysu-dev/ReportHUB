package routes

import (
	"infraalert-backend/handlers"
	"infraalert-backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Public routes
	r.POST("/api/register", handlers.Register)
	r.POST("/api/login", handlers.Login)

	// Protected routes
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		api.POST("/reports", handlers.CreateReport)
		api.GET("/reports", handlers.GetReports)
		api.GET("/reports/:id", handlers.GetReportByID)
		api.DELETE("/reports/:id", handlers.DeleteReport)
		api.GET("/dashboard/stats", handlers.GetDashboardStats)

		// User profile routes
		api.PUT("/user/profile", handlers.UpdateProfile)
		api.PUT("/user/password", handlers.UpdatePassword)
		api.DELETE("/user", handlers.DeleteAccount)
		api.GET("/user/export", handlers.ExportUserData)

		// Admin only
		admin := api.Group("/admin")
		admin.Use(middleware.AdminOnlyMiddleware())
		{
			admin.PUT("/reports/:id/status", handlers.UpdateReportStatus)
		}
	}

	return r
}