package main

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DB export
var DB *mongo.Database

// DBSetup func
func DBSetup() {
	ctx := context.Background()
	var err error
	DB, err = configDB(ctx)
	if err != nil {
		fmt.Println(err)
	}
}

func configDB(ctx context.Context) (*mongo.Database, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGO_CONNECTION_STRING")))
	if err != nil {
		return nil, fmt.Errorf("ouldn't connect to mongo: %v", err)
	}
	err = client.Connect(ctx)
	if err != nil {
		return nil, fmt.Errorf("mongo client couldn't connect with background context: %v", err)
	}
	db := client.Database("boiler")
	return db, nil
}
