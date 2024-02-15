// main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"server/game"
	"server/websocket"
)

func main() {
	http.HandleFunc("/ws", websocket.HandleWebSocketConnection)

	game.StartGameServer()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}

	fmt.Printf("Server started on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
