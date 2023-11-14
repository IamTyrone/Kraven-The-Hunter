package controllers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)


type Payload struct {
	Url string `json:"url"`
}


func EngineProxy(c *fiber.Ctx) error{
	var payload Payload

	err := json.Unmarshal([]byte(c.Body()), &payload)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	url, err := cleanUrl(payload.Url)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	classification, err := fetchClassification((url))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}



	return c.JSON(fiber.Map{
		"message": classification,
	})
}


func cleanUrl(url string) (string, error) {

	return url, nil
}

func fetchClassification(url string) (string, error) {
	return "", nil
}