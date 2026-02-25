package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"nexus-backend/models"
	"nexus-backend/scanner"
)

func main() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))
	time.Sleep(2 * time.Second)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Database connection error: %v\n", err)
		os.Exit(1)
	}

	if err := db.AutoMigrate(&models.Site{}); err != nil {
		fmt.Printf("Migration error: %v\n", err)
	}

	go scanner.StartWorker(db)

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "online", "db": "connected"})
		})

		api.GET("/sites", func(c *gin.Context) {
			var sites []models.Site
			if err := db.Find(&sites).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
				return
			}
			c.JSON(http.StatusOK, sites)
		})

		api.POST("/sites", func(c *gin.Context) {
			var site models.Site
			if err := c.ShouldBindJSON(&site); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			if err := db.Create(&site).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create site"})
				return
			}
			c.JSON(http.StatusCreated, site)
		})
	}

	fmt.Println("Server running on port 8080")
	r.Run(":8080")
}