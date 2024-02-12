// main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"server/websocket"
)

func main() {
	http.HandleFunc("/ws", websocket.HandleWebSocketConnection)

	port := 8080
	fmt.Printf("Server started on :%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
