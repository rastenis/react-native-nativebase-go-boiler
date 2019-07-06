package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
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

var store = sessions.NewCookieStore(securecookie.GenerateRandomKey(16),
	securecookie.GenerateRandomKey(16))

func init() {
	store.Options = &sessions.Options{
		MaxAge:   3600 * 8, // 8 hours
		HttpOnly: true,
	}

	TestDb()
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	log.Print(securecookie.GenerateRandomKey(16),
		securecookie.GenerateRandomKey(16))

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
		session, _ := store.Get(req, "boiler-session")
		log.Print(session.Values["testing"])

		// send back the session + static data
		sessionData := SessionData{[]Person{{"Jack Hill", 421}, {"Jack Wright", 212}}, true}
		js, err := json.Marshal(sessionData)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		res.Header().Set("Content-Type", "application/json")
		res.Write(js)
	})

	http.ListenAndServe(":8080", router)
}
