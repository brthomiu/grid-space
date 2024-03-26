// main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"server/api"
	"server/game"
	"server/websocket"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", api.HandleOptions) // Handler for OPTIONS requests

	// Handle OPTIONS requests
	r.Methods(http.MethodOptions).HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// RESTful routes for authentication
	r.HandleFunc("/api/login", api.HandleLogin).Methods("POST")
	r.HandleFunc("/api/register", api.HandleRegister).Methods("POST")
	r.HandleFunc("/api/guestlogin", api.HandleGuestLogin).Methods("POST")

	r.HandleFunc("/ws", websocket.HandleWebSocketConnection)

	game.StartGameServer()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}

	// CORS middleware
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	fmt.Printf("Server started on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler(r)))
}
