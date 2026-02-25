package models

import (
    "time"
    "gorm.io/gorm"
)

type Site struct {
    gorm.Model
    Name       string        `json:"name"`
    URL        string        `json:"url" gorm:"unique;not null"`
    Latency    int64         `json:"latency"`
    IsUp       bool          `json:"is_up"`
    LastStatus int           `json:"last_status"`
    LastCheck  time.Time     `json:"last_check"`
    History    []SiteHistory `json:"history" gorm:"foreignKey:SiteID"`
}

type SiteHistory struct {
    gorm.Model
    SiteID    uint      `json:"site_id" gorm:"index"`
    IsUp      bool      `json:"is_up"`
    Latency   int64     `json:"latency"`
    CheckedAt time.Time `json:"checked_at"`
}