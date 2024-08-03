package entity

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Sku     string
	Name    string
	Picture string
	Price   float32
	Amount  int
}
type Cart struct {
	gorm.Model
	Amount int

	ProductID *uint
	Product   Product `gorm:"references:id; constraint:OnDelete:CASCADE"`
}
type Order struct { // all data in the bill
	gorm.Model
	TotalPrice  float32
	OrderNumber string

	OrderDetails []OrderDetail `gorm:"foreignKey:OrderID; constraint:OnDelete:CASCADE"`
}
type OrderDetail struct {
	gorm.Model
	OrderID *uint
	Order   Order `gorm:"references:id"`

	Name       string
	Picture    string
	Price      float32
	Amount     int
	TotalPrice float32
}
