package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

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
	Auth           bool
	AppRedirectUrl string
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

type googleUserData struct {
	Email   string
	Id      string
	Picture string
}

var store *sessions.CookieStore
var googleOauthConfig *oauth2.Config
var googleRandomState = "randomizethis123918230192830"

const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	googleOauthConfig = &oauth2.Config{
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}

	store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET1")),
		[]byte(os.Getenv("SESSION_SECRET2")))

	store.Options = &sessions.Options{
		MaxAge:   3600 * 8, // 8 hours
		HttpOnly: true,
	}
}

func main() {

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
		authStatus, ok := session.Values["auth"].(bool)
		if !ok {
			authStatus = false
		}
		sessionData := SessionData{authStatus, ""}
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

		res.WriteHeader(http.StatusOK)
	})

	router.HandleFunc("/auth/google", oauthGoogleRedirect).Methods("GET")
	router.HandleFunc("/callback/google", oauthGoogleCallback).Methods("GET")

	log.Println("Listening on port " + os.Getenv("PORT"))
	http.ListenAndServe(":"+os.Getenv("PORT"), router)
}

func oauthGoogleRedirect(res http.ResponseWriter, req *http.Request) {

	keys, ok := req.URL.Query()["redirectUrl"]

	if !ok || len(keys[0]) < 1 {
		log.Println("Redirection URL is missing.")
		return
	}
	key := keys[0]

	url := googleOauthConfig.AuthCodeURL(googleRandomState + "|" + string(key))
	http.Redirect(res, req, url, http.StatusTemporaryRedirect)
}

func oauthGoogleCallback(res http.ResponseWriter, req *http.Request) {
	// Read oauthState from Cookie

	if strings.Split(req.FormValue("state"), "|")[0] != googleRandomState {
		log.Println("invalid oauth google state")
		http.Redirect(res, req, "/", http.StatusTemporaryRedirect)
		return
	}

	data, err := getUserDataFromGoogle(req.FormValue("code"))
	if err != nil {
		log.Println(err.Error())
		http.Redirect(res, req, "/", http.StatusTemporaryRedirect)
		return
	}

	log.Println(data.Id)

	http.Redirect(res, req, strings.Split(req.FormValue("state"), "|")[1], http.StatusTemporaryRedirect)
}

func getUserDataFromGoogle(code string) (result googleUserData, e error) {
	// Use code to get token and get user info from Google.
	var receivedGoogleData googleUserData

	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return receivedGoogleData, fmt.Errorf("code exchange wrong: %s", err.Error())
	}
	response, err := http.Get(oauthGoogleUrlAPI + token.AccessToken)
	if err != nil {
		return receivedGoogleData, fmt.Errorf("failed getting user info: %s", err.Error())
	}
	defer response.Body.Close()

	// retrieving user id
	decoder := json.NewDecoder(response.Body)
	decoder.Decode(&receivedGoogleData)

	if err != nil {
		return receivedGoogleData, fmt.Errorf("failed read response: %s", err.Error())
	}
	return receivedGoogleData, nil
}
