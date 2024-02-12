package websocket

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var broadcastChannel = make(chan Message, 500)
var clients = make(map[*websocket.Conn]bool)
var clientsMutex sync.Mutex

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
		log.Printf("Error upgrading to WebSocket: %v", err)
		return
	}
	defer func() {
		conn.Close()
		clientsMutex.Lock()
		delete(clients, conn)
		clientsMutex.Unlock()
		log.Println("WebSocket connection closed.")
	}()

	clientsMutex.Lock()
	clients[conn] = true
	clientsMutex.Unlock()

	initialValue := Message{Value: generateNewValue()}
	err = conn.WriteJSON(initialValue)
	if err != nil {
		log.Printf("Error sending initial value: %v", err)
		return
	}

	// Periodically change the value and broadcast to all clients
	go func() {
		ticker := time.NewTicker(1 * time.Second) // Change value every 1 second, adjust as needed
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				newValue := generateNewValue()
				select {
				case broadcastChannel <- Message{Value: newValue}:
					// Successfully added to the channel
				default:
					// Channel is full, do nothing
				}

				err := conn.WriteJSON(Message{Value: newValue})
				if err != nil {
					log.Printf("Error broadcasting: %v", err)
					return
				}

				log.Printf("Broadcasted message at: %v", time.Now())
			}
		}
	}()

	// Handle the WebSocket connection
	for {
		messageType, _, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v", err)
			log.Println(messageType)
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				log.Println("WebSocket connection closed.")
			}

			return
		}
	}
}

var cyclingValues = []int{10, 11, 12, 11}
var counter int
var counterMutex sync.Mutex

func generateNewValue() int {
	counterMutex.Lock()
	defer counterMutex.Unlock()

	value := cyclingValues[counter]
	counter = (counter + 1) % len(cyclingValues)

	fmt.Printf("Broadcasting new value: %d (counter: %d)\n", value, counter)

	return value
}
