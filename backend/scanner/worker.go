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
					success, statusCode := CheckSite(s.URL)
					
					db.Model(&s).Updates(map[string]interface{}{
						"is_up":       success,
						"last_status": statusCode,
						"updated_at":  time.Now(),
					})
				}(site)
			}
		}
	}()
}