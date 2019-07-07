package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

// Person : stores a single person's data
type Person struct {
	Name   string
	Number int
}

// SessionData : to send back session data
type SessionData struct {
	People []Person
	Auth   bool
}

// Response : used for returning status data to user
type Response struct {
	Success bool
	Msg     string
}

type user struct {
	email    string
	password string
}

var store = sessions.NewCookieStore(securecookie.GenerateRandomKey(16),
	securecookie.GenerateRandomKey(16))

func init() {
	store.Options = &sessions.Options{
		MaxAge:   3600 * 8, // 8 hours
		HttpOnly: true,
	}

}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	DBSetup()

	router := mux.NewRouter()
	router.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		// gettinng the session
		session, _ := store.Get(req, "boiler-session")
		session.Values["testing"] = "session storage"
		// Save.
		if err = sessions.Save(req, res); err != nil {
			log.Printf("Error saving session: %v", err)
		}

		fmt.Fprint(res, "This is the index page.")
	})

	router.HandleFunc("/session", func(res http.ResponseWriter, req *http.Request) {
		fmt.Println("Retreiving session...")

		// send back the session + static data
		sessionData := SessionData{[]Person{{"Jack Hill", 421}, {"Jack Wright", 212}}, true}
		js, err := json.Marshal(sessionData)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		log.Println(sessionData.Auth)

		res.Header().Set("Content-Type", "application/json")
		res.Write(js)
	})

	router.HandleFunc("/api/auth", func(res http.ResponseWriter, req *http.Request) {
		err := req.ParseForm()
		if err != nil {
			log.Println("Could not parse form.")
		}
		log.Println("Logging in user:", req.Form.Get("email"))
		res.Header().Set("Content-Type", "application/json")

		// fetching user
		ctx := context.Background()
		foundUser := DB.Collection("users").FindOne(ctx, bson.M{"email": req.Form.Get("email")})
		var u user
		decodeError := foundUser.Decode(&u)
		if decodeError != nil {
			log.Println("Login failed. No user.")
			response, _ := json.Marshal(Response{false, "Invalid login details!"})
			res.Write(response)
			return
		}

		// checking password
		comparisonError := bcrypt.CompareHashAndPassword([]byte(u.password), []byte(req.Form.Get("password")))
		if comparisonError == nil {
			log.Println("Login failed.")
			response, _ := json.Marshal(Response{false, "Invalid login details!"})
			res.Write(response)
			return
		}
		log.Println("Login successful.")

		response, err := json.Marshal(Response{true, "Successfully logged in!"})
		if err != nil {
			log.Println("Could not marshal response")
		}
		res.Write(response)

	})
	http.ListenAndServe(":8080", router)
}
