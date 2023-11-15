package controllers

import "strings"


func CleanUrl(url string) (string, error) {
	if strings.Contains(url, "http://") {
		return strings.ReplaceAll(url, "http://", "",), nil
	}

	if strings.Contains(url, "https://") {
		return strings.ReplaceAll(url, "https://", "",), nil
	}

	return url, nil
}