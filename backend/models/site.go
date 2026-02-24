package models

import "gorm.io/gorm"

type Site struct {
    gorm.Model
    Name       string `json:"name"`
    URL        string `json:"url" gorm:"unique;not null"`
    IsUp       bool   `json:"is_up"`
    LastStatus int    `json:"last_status"`
}