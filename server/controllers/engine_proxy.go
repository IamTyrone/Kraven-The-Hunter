package controllers

import (
	"encoding/json"
	controllers "kraven/controllers/utils"

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

	url, err := controllers.CleanUrl(payload.Url)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	classification, err := controllers.FetchClassification((url))

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