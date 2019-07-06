package main

import (
	"context"
	"fmt"
	"log"
	"time"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// TestDb func
func TestDb() {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	collection := client.Database("testing").Collection("numbers")

	ctx, _ = context.WithTimeout(context.Background(), 5*time.Second)
	res, err := collection.InsertOne(ctx, bson.M{"name": "pi", "value": 3.14159})
	id := res.InsertedID
	fmt.Println(id)
}
