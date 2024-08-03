package controller

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sut65/team01/entity"
)

// POST /products
func CreateProduct(c *gin.Context) {
	var product entity.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	p := entity.Product{
		Sku:     product.Sku,
		Name:    product.Name,
		Picture: product.Picture,
		Price:   product.Price,
		Amount:  product.Amount,
	}
	if err := entity.DB().Create(&p).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": p})
}

// GET /product/:id
func GetProduct(c *gin.Context) {
	var product entity.Product
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM products WHERE id = ?", id).
		Find(&product).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": product})
}

// GET /products?name=abc&sku=TU123
func ListProducts(c *gin.Context) {
	name := c.Query("name")
	sku := c.Query("sku")
	var criteria []interface{}
	whereSql := []string{}

	sql := "SELECT * FROM products "
	if len(name) != 0 {
		criteria = append(criteria, "%"+name+"%")
		whereSql = append(whereSql, "name like ?")
	}
	if len(sku) != 0 {
		criteria = append(criteria, "%"+sku+"%")
		whereSql = append(whereSql, "sku like ?")
	}
	// append sql condition if criteria is not empty
	if len(criteria) != 0 {
		sql = sql + " where " + strings.Join(whereSql, " or ")
	}

	var products []entity.Product
	if err := entity.DB().Raw(sql, criteria...).
		Find(&products).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": products})
}

// DELETE /products/:id
func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	// Delete from carts where product_id is referenced

	if tx := entity.DB().Exec("DELETE FROM products WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}
	if tx := entity.DB().Exec("DELETE FROM carts WHERE product_id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /products
func UpdateProduct(c *gin.Context) {
	var payload entity.Product
	var product entity.Product

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", payload.ID).First(&product); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product_id not found"})
		return
	}

	updateproduct := entity.Product{
		Sku:     payload.Sku,
		Name:    payload.Name,
		Picture: payload.Picture,
		Price:   payload.Price,
		Amount:  payload.Amount,
	}

	if err := entity.DB().Where("id = ?", product.ID).Updates(&updateproduct).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "Updating Success!", "data": product})
}
