package routes

import (
	"kraven/controllers"

	"github.com/gofiber/fiber/v2"
)


func Routes(app *fiber.App){
	route := app.Group("/api/v1")
	route.Post("/engine-proxy", controllers.EngineProxy)
}