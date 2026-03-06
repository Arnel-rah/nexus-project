package scanner

import (
	"time"

	"nexus-backend/models"

	"gorm.io/gorm"
)

func StartWorker(db *gorm.DB) {
	ticker := time.NewTicker(time.Millisecond)
	performScan := func() {
		var sites []models.Site
		if err := db.Find(&sites).Error; err != nil {
			return
		}

		for _, site := range sites {
			go func(s models.Site) {
				result := CheckSite(s.URL, 10*time.Second)

				db.Model(&s).Updates(map[string]interface{}{
					"is_up":       result.Up,
					"last_status": 200,
					"latency":     result.Latency.Milliseconds(),
					"last_check":  time.Now(),
				})

				db.Create(&models.SiteHistory{
					SiteID:    s.ID,
					IsUp:      result.Up,
					Latency:   result.Latency.Milliseconds(),
					CheckedAt: time.Now(),
				})
			}(site)
		}
	}

	go func() {
		performScan()
		for range ticker.C {
			performScan()
		}
	}()
}
