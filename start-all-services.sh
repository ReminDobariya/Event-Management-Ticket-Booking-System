#!/bin/bash

# Bash script to start all services
echo "Starting all SOA services..."

# Start Event Service
gnome-terminal -- bash -c "cd event-service && npm start; exec bash" 2>/dev/null || \
xterm -e "cd event-service && npm start" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd event-service && npm start"' 2>/dev/null || \
echo "Please start Event Service manually: cd event-service && npm start"

sleep 2

# Start Booking Service
gnome-terminal -- bash -c "cd booking-service && npm start; exec bash" 2>/dev/null || \
xterm -e "cd booking-service && npm start" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd booking-service && npm start"' 2>/dev/null || \
echo "Please start Booking Service manually: cd booking-service && npm start"

sleep 2

# Start Payment Service
gnome-terminal -- bash -c "cd payment-service && npm start; exec bash" 2>/dev/null || \
xterm -e "cd payment-service && npm start" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd payment-service && npm start"' 2>/dev/null || \
echo "Please start Payment Service manually: cd payment-service && npm start"

sleep 2

# Start Notification Service
gnome-terminal -- bash -c "cd notification-service && npm start; exec bash" 2>/dev/null || \
xterm -e "cd notification-service && npm start" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd notification-service && npm start"' 2>/dev/null || \
echo "Please start Notification Service manually: cd notification-service && npm start"

echo "All services started!"
echo "Check each terminal window for service status"


