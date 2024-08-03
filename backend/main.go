package main

import (
	"github.com/gin-gonic/gin"
	"github.com/sut65/team01/controller"
	"github.com/sut65/team01/entity"
)

func main() {
	entity.SetupDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())

	r.GET("/products", controller.ListProducts)
	r.GET("/product/:id", controller.GetProduct)
	r.POST("/products", controller.CreateProduct)
	r.PATCH("/products", controller.UpdateProduct)
	r.DELETE("/products/:id", controller.DeleteProduct)

	r.GET("/carts", controller.ListCarts)
	r.GET("/cart/:id", controller.GetCart)
	r.POST("/carts", controller.CreateCart)
	r.PATCH("/carts", controller.UpdateCart)
	r.DELETE("/carts/:id", controller.DeleteCart)

	r.GET("/orders", controller.ListOrder)
	r.GET("/order/:id", controller.GetOrder)
	r.POST("/orders", controller.CreateOrder)

	// Run the server
	r.Run()
}
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
