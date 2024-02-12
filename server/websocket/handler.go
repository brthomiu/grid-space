// websocket/handler.go
package websocket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var broadcastChannel = make(chan Message, 10)
var clients = make(map[*websocket.Conn]bool)

// Message represents the structure of messages sent over WebSocket
type Message struct {
	Value int `json:"value"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWebSocketConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	// Register the client
	clients[conn] = true

	// Handle the WebSocket connection
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err, "messageType: ", messageType, "p: ", p)
			delete(clients, conn)
			return
		}

		// Handle the message as needed

		// Broadcast the message to all clients
		broadcastChannel <- Message{Value: 42} // Replace 42 with the actual integer value
	}
}
