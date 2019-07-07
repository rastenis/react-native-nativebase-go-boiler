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

// People :
type people struct {
	People []Person
}

// SessionData : to send back session data
type SessionData struct {
	// User ~~userdata
	Auth bool
}

// Response : used for returning status data to user
type Response struct {
	Success bool
	Msg     string
}

type user struct {
	Email    string
	Password string
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

	// setting up database
	DBSetup()

	router := mux.NewRouter()
	router.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		fmt.Fprint(res, "This is the index page.")
	})

	router.HandleFunc("/session", func(res http.ResponseWriter, req *http.Request) {
		fmt.Println("Retreiving session...")

		// send back the session data
		session, _ := store.Get(req, "boiler-session")
		log.Println(session.Values["auth"])
		authStatus, ok := session.Values["auth"].(bool)
		if !ok {
			log.Println("Couldnt cast session auth to bool.")
		}
		sessionData := SessionData{authStatus}
		js, err := json.Marshal(sessionData)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		log.Println(sessionData.Auth)

		res.Header().Set("Content-Type", "application/json")
		res.Write(js)
	})

	router.HandleFunc("/user", func(res http.ResponseWriter, req *http.Request) {
		fmt.Println("Retreiving users...")

		// send back the session data
		session, _ := store.Get(req, "boiler-session")
		log.Println(session.Values["auth"])
		authStatus, ok := session.Values["auth"].(bool)
		if !ok || !authStatus {
			log.Println("Couldnt cast session auth to bool. Unauthorized.")
			res.WriteHeader(http.StatusForbidden)
			return
		}

		ppl := people{[]Person{{"Jack Hill", 421}, {"Jack Wright", 212}}}

		js, err := json.Marshal(ppl)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		res.Header().Set("Content-Type", "application/json")
		res.Write(js)
	})

	router.HandleFunc("/api/auth", func(res http.ResponseWriter, req *http.Request) {
		// decoding userdata
		decoder := json.NewDecoder(req.Body)
		var postedUserData user
		err := decoder.Decode(&postedUserData)
		if err != nil {
			log.Panicln(err)
		}

		log.Printf("Logging in user: %s", postedUserData.Email)

		res.Header().Set("Content-Type", "application/json")

		// fetching user
		ctx := context.Background()
		foundUser := DB.Collection("users").FindOne(ctx, bson.M{"email": postedUserData.Email})
		var u user
		decodeError := foundUser.Decode(&u)
		if decodeError != nil {
			log.Println(decodeError)
			log.Println("Login failed. No user.")
			response, _ := json.Marshal(Response{false, "Invalid login details!"})
			res.Write(response)
			return
		}

		// checking password
		comparisonError := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(req.Form.Get("password")))
		if comparisonError == nil {
			log.Println("Login failed. Wrong password.")
			response, _ := json.Marshal(Response{false, "Invalid login details!"})
			res.Write(response)
			return
		}

		log.Println("Login successful.")

		// setting session data
		session, _ := store.Get(req, "boiler-session")
		session.Values["auth"] = true // now able to get users in the index page
		if err = sessions.Save(req, res); err != nil {
			log.Printf("Error saving session: %v", err)
		}

		// sending a success response
		response, err := json.Marshal(Response{true, "Successfully logged in!"})
		if err != nil {
			log.Println("Could not marshal response")
		}
		res.Write(response)
	})

	log.Println("Listening on port 8080")
	http.ListenAndServe(":8080", router)
}
