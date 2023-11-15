package main

import (
	"kraven/routes"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)




func main()  {
    err := godotenv.Load(".env")

    if err != nil {
        log.Fatal("Error loading .env file")
    }
    
	app := fiber.New()

    routes.Routes(app)

    app.Listen(":8080")
}