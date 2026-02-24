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
	// CONNEXION DB
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

	time.Sleep(2 * time.Second)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Erreur de connexion DB: %v\n", err)
		os.Exit(1)
	}

	// MIGRATIONS
	db.AutoMigrate(&models.Site{})

	// LANCEMENT  WORKER 
	go scanner.StartWorker(db) 

	// CONFIGURATION SERVEUR API
	r := gin.Default()

	// Middleware CORS 
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

	// ROUTES
	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "online", "db": "connected"})
		})

		api.GET("/sites", func(c *gin.Context) {
			var sites []models.Site
			db.Find(&sites)
			c.JSON(http.StatusOK, sites)
		})

		api.POST("/sites", func(c *gin.Context) {
			var site models.Site
			if err := c.ShouldBindJSON(&site); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			db.Create(&site)
			c.JSON(http.StatusCreated, site)
		})
	}

	fmt.Println("Backend Nexus démarré sur le port 8080")
	r.Run(":8080")
}