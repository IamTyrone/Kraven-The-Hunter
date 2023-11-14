package main

import (
	"kraven/routes"

	"github.com/gofiber/fiber/v2"
)




func main()  {
	app := fiber.New()

    routes.Routes(app)

    app.Listen(":8080")
}