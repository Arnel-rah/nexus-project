package scanner

import (
	"context"
	"fmt"
	"net/http"
	"time"
)

type CheckResult struct {
	Up      bool
	Latency time.Duration
	Error   error
}

func CheckSite(url string, timeout time.Duration) CheckResult {
	return CheckWithRetry(url, timeout)
}

func CheckWithRetry(url string, timeout time.Duration) CheckResult {
	const maxRetries = 3
	const baseRetryDelay = 2 * time.Second

	var lastErr error
	var lastLatency time.Duration

	for attempt := 1; attempt <= maxRetries; attempt++ {
		fmt.Printf("Tentative %d/%d pour %s...\n", attempt, maxRetries, url)

		start := time.Now()

		res := func() *CheckResult {
			ctx, cancel := context.WithTimeout(context.Background(), timeout)
			defer cancel()

			req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
			if err != nil {
				return &CheckResult{Up: false, Error: err}
			}

			client := &http.Client{Timeout: timeout}
			resp, err := client.Do(req)
			latency := time.Since(start)

			if err != nil {
				lastErr = err
				lastLatency = latency
				return nil
			}

			defer resp.Body.Close()

			if resp.StatusCode >= 400 && resp.StatusCode < 500 {
				return &CheckResult{Up: false, Latency: latency, Error: fmt.Errorf("status %d", resp.StatusCode)}
			}

			up := resp.StatusCode >= 200 && resp.StatusCode < 400
			return &CheckResult{Up: up, Latency: latency, Error: nil}
		}()

		if res != nil {
			return *res
		}
		if attempt < maxRetries {
			time.Sleep(baseRetryDelay * time.Duration(1<<uint(attempt-1)))
		}
	}

	return CheckResult{
		Up:      false,
		Latency: lastLatency,
		Error:   fmt.Errorf("abandon après %d tentatives : %v", maxRetries, lastErr),
	}
}