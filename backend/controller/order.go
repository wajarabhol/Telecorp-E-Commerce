package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sut65/team01/entity"
)

// POST /order
func CreateOrder(c *gin.Context) {
	var orderdetail []entity.OrderDetail

	if err := c.ShouldBindJSON(&orderdetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	p := entity.Order{
		TotalPrice:   CalcTotalPrice(orderdetail),
		OrderNumber:  uuid.New().String(),
		OrderDetails: orderdetail,
	}
	if err := entity.DB().Create(&p).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": p})
}

func CalcTotalPrice(orderdetail []entity.OrderDetail) float32 {
	var totalPrice float32 = 0
	for _, o := range orderdetail { // _ => index in the list
		totalPrice += o.Price * float32(o.Amount)
	}
	return totalPrice
}

// GET /order/:id
func GetOrder(c *gin.Context) {
	var order entity.Order
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM orders WHERE id = ?", id).
		Preload("OrderDetails").
		Find(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET /order
func ListOrder(c *gin.Context) {
	var order []entity.Order
	if err := entity.DB().Raw("SELECT * FROM orders").
		Preload("OrderDetails").
		Find(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": order})
}
