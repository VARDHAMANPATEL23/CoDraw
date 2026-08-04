#!/usr/bin/env bash
# CoDraw Application Launcher & Health Monitor (Linux/macOS)

echo "========================================="
echo " Starting CoDraw Application Suite"
echo "========================================="

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR" || exit 1

# Cleanup function on Ctrl+C or exit
cleanup() {
  echo ""
  echo "Shutting down CoDraw processes..."
  kill 0
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start Server
echo "[1/2] Starting Express Backend Server on port 5000..."
npm run start:server &
SERVER_PID=$!

# Start Client
echo "[2/2] Starting React Client Builder on port 3000..."
npm run start:client &
CLIENT_PID=$!

echo ""
echo "Processes launched!"
echo "  - Backend PID: $SERVER_PID"
echo "  - Frontend PID: $CLIENT_PID"
echo ""
echo "Monitoring services (Press Ctrl+C to stop all)..."
echo "-----------------------------------------"

# Monitoring Loop
while true; do
  sleep 5
  TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

  # Check Server Health
  SERVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "DOWN")
  
  # Check Client Health
  CLIENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "DOWN")

  echo "[$TIMESTAMP] Status Check:"
  if [ "$SERVER_STATUS" = "200" ]; then
    echo "  - Express API  : ONLINE (200 OK)"
  else
    echo "  - Express API  : OFFLINE/STARTING (Status: $SERVER_STATUS)"
  fi

  if [ "$CLIENT_STATUS" = "200" ]; then
    echo "  - React Client : ONLINE (200 OK)"
  else
    echo "  - React Client : OFFLINE/STARTING (Status: $CLIENT_STATUS)"
  fi
  echo "-----------------------------------------"
done
