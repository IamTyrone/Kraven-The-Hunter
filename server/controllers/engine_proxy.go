package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
)


type Payload struct {
	Url string `json:"url"`
}

type Classification struct {
	Status string `json:"status"`
	Message string `json:"meesage"`
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
	payload := Payload{
		Url: url,
	}

	json_payload, err := json.Marshal(payload)

	if err != nil {
		fmt.Println(err)
		return "", err
	}


	contentType := "application/json"
	req, err := http.NewRequest("POST" ,os.Getenv("ENGINE_URL") + "/prediction", bytes.NewBuffer(json_payload))

	if err != nil {
		fmt.Println(err)
		return "", err
	}

	req.Header.Add("Content-Type", contentType)


	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		fmt.Println(err)
		return "", err
	}
	
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	fmt.Println(string(body))

	target := Classification{}

	json.Unmarshal([]byte(string(body)), &target)

	fmt.Println(target.Message)

	return target.Message, nil
}