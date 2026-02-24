package scanner

import (
	"net/http"
	"time"
)

func CheckSite(url string) (bool, int) {
	client := http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Get(url)
	if err != nil {
		return false, 0
	}
	defer resp.Body.Close()

	return resp.StatusCode >= 200 && resp.StatusCode < 300, resp.StatusCode
}