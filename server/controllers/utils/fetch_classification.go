package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Payload struct {
	Url string `json:"url"`
}

type Classification struct {
	Status bool `json:"status"`
	Message string `json:"message"`
}

func FetchClassification(url string) (string, error) {
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

	target := Classification{}

	json.Unmarshal([]byte(body), &target)

	return target.Message, nil
}