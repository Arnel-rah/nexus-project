package models

import (
    "time"
    "gorm.io/gorm"
)

type Site struct {
    gorm.Model
    Name       string    `json:"name"`
    URL        string    `json:"url" gorm:"unique;not null"`
    Latency    int64     `json:"latency"` 
    IsUp       bool      `json:"is_up"`
    LastStatus int       `json:"last_status"`
    LastCheck  time.Time `json:"last_check"`
}