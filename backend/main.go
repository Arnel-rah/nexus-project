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
)

type Health struct {
    ID        uint      `gorm:"primaryKey"`
    Status    string    `json:"status"`
    CreatedAt time.Time `json:"created_at"`
}

func main() {
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable",
        os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

    time.Sleep(2 * time.Second)

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        fmt.Printf("Erreur de connexion DB: %v\n", err)
        os.Exit(1)
    }

    db.AutoMigrate(&Health{})
    db.AutoMigrate(&models.Site{})

    r := gin.Default()

    r.GET("/ping", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "pong",
            "database": "connected",
        })
    })

    r.GET("/api/sites", func(c *gin.Context) {
        var sites []models.Site
        db.Find(&sites)
        c.JSON(200, sites)
    })

    r.POST("/api/sites", func(c *gin.Context) {
        var site models.Site
        if err := c.ShouldBindJSON(&site); err != nil {
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }
        db.Create(&site)
        c.JSON(201, site)
    })

    fmt.Println("Backend démarré sur le port 8080")
    r.Run(":8080")
}