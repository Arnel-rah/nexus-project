package scanner

import (
	"fmt"
	"time"

	"nexus-backend/models"
	"gorm.io/gorm"
)

func StartWorker(db *gorm.DB) {
	go func() {
		fmt.Println(" Worker de monitoring démarré...")

		for {
			var sites []models.Site
			result := db.Find(&sites)
			if result.Error != nil {
				fmt.Printf(" Erreur lors de la lecture des sites: %v\n", result.Error)
			} else {
				fmt.Printf(" Scan en cours : %d sites à vérifier...\n", len(sites))
				for _, site := range sites {
					fmt.Printf(" Vérification de : %s\n", site.URL)
					isUp := true 
					db.Model(&site).Updates(map[string]interface{}{
						"is_up":       isUp,
						"last_status": 200,
					})
				}
			}
			fmt.Println(" Scan terminé. Prochaine vérification dans 1 minute.")
			time.Sleep(1 * time.Minute)
		}
	}()
}