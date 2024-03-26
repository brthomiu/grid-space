// api/api.go
package api

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"server/types"
)

func HandleOptions(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for preflight requests
	w.Header().Set("Access-Control-Allow-Origin", "*")              // Allow requests from any origin
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS") // Allow POST and OPTIONS methods
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")  // Allow Content-Type header
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	log.Printf("POST to login route")
}

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	log.Printf("POST to registration route")
}

func HandleGuestLogin(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")              // Allow requests from any origin
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS") // Allow POST and OPTIONS methods
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")  // Allow Content-Type header

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		http.Error(w, "can't read body", http.StatusBadRequest)
		return
	}

	var msg types.GuestLoginMessage
	err = json.Unmarshal(body, &msg)
	if err != nil {
		log.Printf("Error decoding JSON: %v", err)
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	log.Printf("POST to guest route: Type = %s, Name = %s", msg.Type, msg.Payload.Name)

	// Set the response status to 200 OK
	w.WriteHeader(http.StatusOK)
}
