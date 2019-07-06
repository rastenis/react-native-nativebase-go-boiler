package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

var store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// gettinng the session
		session, _ := store.Get(r, "boiler-session")

		session.Values["testing"] = "session storage"
		session.Save(r, w)

		fmt.Fprint(w, "This is the index page.")
	})

	router.HandleFunc("/session", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Refreshing session.")
		fmt.Fprint(w, "Session.")
		session, _ := store.Get(r, "boiler-session")
		for key, val := range session.Values {
			fmt.Printf("%s=%s\n", key, val)
		}

		// send back the session
	})

	http.ListenAndServe(":80", router)
}
