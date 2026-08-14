#!/usr/bin/env bash
# CoDraw Application Launcher & Health Monitor (Linux/macOS)
# Uses Bun for faster startup and dependency resolution.
# Professional TUI Dashboard

# Colors and formatting
RESET="\033[0m"
BOLD="\033[1m"
DIM="\033[2m"
BLUE="\033[34m"
MAGENTA="\033[35m"
CYAN="\033[36m"
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR" || exit 1

cleanup() {
  tput cnorm # Show cursor
  echo -e "\n\n${RED}Shutting down CoDraw processes...${RESET}"
  kill 0
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start Server
cd "$PROJECT_DIR/server" && bun run index.js > /dev/null 2>&1 &
SERVER_PID=$!

# Start Client
cd "$PROJECT_DIR/client" && bun run start > /dev/null 2>&1 &
CLIENT_PID=$!

tput civis # Hide cursor
clear

while true; do
  tput cup 0 0 # Move to top-left
  
  TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
  
  # Fetch stats
  SERVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 2 http://localhost:5000/api/health || echo "DOWN")
  CLIENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 2 http://localhost:3000 || echo "DOWN")

  if [ "$SERVER_STATUS" = "200" ]; then
    S_STATUS_TEXT="${GREEN}● ONLINE ${RESET}"
  else
    S_STATUS_TEXT="${YELLOW}○ STARTING...${RESET}"
  fi

  if [ "$CLIENT_STATUS" = "200" ]; then
    C_STATUS_TEXT="${GREEN}● ONLINE ${RESET}"
  else
    C_STATUS_TEXT="${YELLOW}○ STARTING...${RESET}"
  fi

  MEM_INFO=$(free -m 2>/dev/null | awk '/Mem:/ { print $3 "MB / " $2 "MB" }' || echo "N/A")
  CPU_INFO=$(top -bn1 2>/dev/null | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}' || echo "N/A")
  UPTIME=$(uptime -p 2>/dev/null | sed 's/up //' || echo "N/A")

  # ASCII Art Logo
  echo -e "${CYAN}${BOLD}   ______      ____                        \033[K"
  echo -e "  / ____/___  / __ \\_________ __      __   \033[K"
  echo -e " / /   / __ \\/ / / / ___/ __ \`/ | /| / /   \033[K"
  echo -e "/ /___/ /_/ / /_/ / /  / /_/ /| |/ |/ /    \033[K"
  echo -e "\\____/\\____/_____/_/   \\__,_/ |__/|__/     ${RESET}\033[K"
  echo -e "\033[K"
  
  echo -e " ${BOLD}${BLUE}sys${RESET}       $USER@$HOSTNAME\033[K"
  echo -e " ${BOLD}${BLUE}os${RESET}        $(uname -s -r)\033[K"
  echo -e " ${BOLD}${BLUE}up${RESET}        $UPTIME\033[K"
  echo -e " ${BOLD}${BLUE}ram${RESET}       $MEM_INFO\033[K"
  echo -e " ${BOLD}${BLUE}cpu${RESET}       $CPU_INFO\033[K"
  echo -e " ${BOLD}${BLUE}time${RESET}      $TIMESTAMP\033[K"
  echo -e "\033[K"
  
  echo -e " ${BOLD}${MAGENTA}services${RESET}  ${CYAN}CoDraw Engine${RESET}\033[K"
  echo -e " ${BOLD}${BLUE}├─ api${RESET}    PID: $SERVER_PID | Port: 5000 | Status: $S_STATUS_TEXT\033[K"
  echo -e " ${BOLD}${BLUE}└─ ui${RESET}     PID: $CLIENT_PID | Port: 3000 | Status: $C_STATUS_TEXT\033[K"
  echo -e "\033[K"
  
  echo -e " ${DIM}Press Ctrl+C to stop all services and exit...${RESET}\033[K"
  
  # Clear remaining lines to prevent artifacts
  echo -e "\033[J"
  
  sleep 2
done
