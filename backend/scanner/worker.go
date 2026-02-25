package scanner

import (
	"time"

	"nexus-backend/models"
	"gorm.io/gorm"
)

func StartWorker(db *gorm.DB) {
	ticker := time.NewTicker(1 * time.Minute)

	go func() {
		for range ticker.C {
			var sites []models.Site
			if err := db.Find(&sites).Error; err != nil {
				continue
			}

			for _, site := range sites {
				go func(s models.Site) {
					result := CheckSite(s.URL, 10*time.Second)
						db.Model(&s).Updates(map[string]interface{}{
						"is_up":       result.Up,
						"last_status": 200, 
						"updated_at":  time.Now(),
					})
				}(site)
			}
		}
	}()
}