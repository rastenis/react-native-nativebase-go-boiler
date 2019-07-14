package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
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

var googleOauthConfig *oauth2.Config

var googleRandomState="TODO:randomized"

func init() {
	googleOauthConfig = &oauth2.Config{
		RedirectURL: 	os.Getenv("GOOGLE_REDIRECT_URL"),
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
}


func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	var store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET1")),
[]byte(os.Getenv("SESSION_SECRET2")))

	store.Options = &sessions.Options{
		MaxAge:   3600 * 8, // 8 hours
		HttpOnly: true,
	}

	// setting up database
	DBSetup()

	router := mux.NewRouter()
	router.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		fmt.Fprint(res, "This is the index page.")
	})

	router.HandleFunc("/api/session", func(res http.ResponseWriter, req *http.Request) {
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

	router.HandleFunc("/api/people", func(res http.ResponseWriter, req *http.Request) {
		fmt.Println("Retreiving people...")

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
			res.WriteHeader(http.StatusUnauthorized)
			res.Write(response)
			return
		}

		// checking password
		comparisonError := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(req.Form.Get("password")))
		if comparisonError == nil {
			log.Println("Login failed. Wrong password.")
			response, _ := json.Marshal(Response{false, "Invalid login details!"})
			res.WriteHeader(http.StatusUnauthorized)
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

	router.HandleFunc("/api/register", func(res http.ResponseWriter, req *http.Request) {
		// decoding userdata
		decoder := json.NewDecoder(req.Body)
		var postedUserData user
		err := decoder.Decode(&postedUserData)
		if err != nil {
			log.Panicln(err)
		}

		log.Printf("Registering user: %s", postedUserData.Email)

		res.Header().Set("Content-Type", "application/json")

		// checking for duplicates
		ctx := context.Background()
		foundUser := DB.Collection("users").FindOne(ctx, bson.M{"email": postedUserData.Email})
		var dupe user
		decodeError := foundUser.Decode(&dupe)
		if decodeError == nil {
			log.Println("Registration failed. Duplicate user.")
			response, _ := json.Marshal(Response{false, "An user with that email already exists!"})
			res.WriteHeader(http.StatusBadRequest)
			res.Write(response)
			return
		}

		// hashing password
		hashed, _ := bcrypt.GenerateFromPassword([]byte(postedUserData.Password), 12)
		hashedConverted := string(hashed)

		// inserting user
		creationResult, creationError := DB.Collection("users").InsertOne(ctx, bson.M{"email": postedUserData.Email, "password": hashedConverted})
		log.Println(creationResult)
		if creationError != nil {
			log.Panicln(creationError)
		}

		log.Println("Registration successful.")

		// setting session data
		session, _ := store.Get(req, "boiler-session")
		session.Values["auth"] = true // now able to get users in the index page
		if err = sessions.Save(req, res); err != nil {
			log.Printf("Error saving session: %v", err)
		}

		// sending a success response
		response, err := json.Marshal(Response{true, "Successfully registered!"})
		if err != nil {
			log.Println("Could not marshal response")
		}
		res.Write(response)
	})

	router.HandleFunc("/api/logout", func(res http.ResponseWriter, req *http.Request) {

		// deleting session
		session, _ := store.Get(req, "boiler-session")
		session.Options.MaxAge = -1
		if err = sessions.Save(req, res); err != nil {
			log.Printf("Error saving session: %v", err)
		}

		res.WriteHeader(http.StatusOK)
	})

	router.HandleFunc("/auth/google", func(res http.ResponseWriter, req *http.Request) {
		url := googleOauthConfig.AuthCodeURL(googleRandomState)
		http.Redirect(res, req, url, http.StatusTemporaryRedirect)
	})

	log.Println("Listening on port "+os.Getenv("PORT"))
	http.ListenAndServe(":"+ os.Getenv("PORT"), router)
}
