#!/usr/bin/env bash
# CoDraw Application Launcher & Health Monitor (Linux/macOS)
# Professional 3-Column TUI Dashboard

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
  trap - SIGINT SIGTERM EXIT
  tput cnorm # Show cursor
  clear
  echo -e "${RED}Shutting down CoDraw processes...${RESET}"
  kill 0
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start Server
> /tmp/codraw_server.log
cd "$PROJECT_DIR/server" && bun run index.js > /tmp/codraw_server.log 2>&1 &
SERVER_PID=$!

# Start Client
> /tmp/codraw_client.log
cd "$PROJECT_DIR/client" && bun run start > /tmp/codraw_client.log 2>&1 &
CLIENT_PID=$!

tput civis # Hide cursor
clear

while true; do
  COLS=$(tput cols)
  LINES=$(tput lines)
  
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

  # Only use 3 columns if terminal is wide enough (e.g. > 130 cols)
  if [ "$COLS" -ge 130 ]; then
    C1_WIDTH=65
    C2_WIDTH=$(( (COLS - C1_WIDTH) / 2 ))
    
    C1_START=0
    C2_START=$C1_WIDTH
    C3_START=$(( C1_WIDTH + C2_WIDTH ))
    
    LOG_LINES=$(( LINES - 6 ))
  else
    C1_START=0
    C2_START=0
    C3_START=0
    LOG_LINES=0
  fi

  # Render Loop
  tput cup 0 0
  
  # ASCII Art Logo (Column 1)
  echo -e "${CYAN}${BOLD}   ______      ____                        "
  echo -e "  / ____/___  / __ \_________ __      __   "
  echo -e " / /   / __ \/ / / / ___/ __ \`/ | /| / /   "
  echo -e "/ /___/ /_/ / /_/ / /  / /_/ /| |/ |/ /    "
  echo -e "\\____/\\____/_____/_/   \\__,_/ |__/|__/     ${RESET}"
  echo -e "                                           "
  
  echo -e " ${BOLD}${BLUE}sys${RESET}       $USER@$HOSTNAME                   "
  echo -e " ${BOLD}${BLUE}os${RESET}        $(uname -s -r)                    "
  echo -e " ${BOLD}${BLUE}up${RESET}        $UPTIME                           "
  echo -e " ${BOLD}${BLUE}ram${RESET}       $MEM_INFO                         "
  echo -e " ${BOLD}${BLUE}cpu${RESET}       $CPU_INFO                         "
  echo -e " ${BOLD}${BLUE}time${RESET}      $TIMESTAMP                        "
  echo -e "                                           "
  
  echo -e " ${BOLD}${MAGENTA}services${RESET}  ${CYAN}CoDraw Engine${RESET}             "
  echo -e " ${BOLD}${BLUE}├─ api${RESET}    PID: $SERVER_PID | Port: 5000 | Status: $S_STATUS_TEXT  "
  echo -e " ${BOLD}${BLUE}└─ ui${RESET}     PID: $CLIENT_PID | Port: 3000 | Status: $C_STATUS_TEXT  "
  echo -e "                                           "
  
  echo -e " ${DIM}Press Ctrl+C to stop all services and exit...${RESET}             "
  
  if [ "$COLS" -ge 130 ]; then
    # Draw Separators
    for ((i=0; i<LINES-2; i++)); do
      tput cup $i $(( C2_START - 2 ))
      echo -e "${DIM}│${RESET}"
      tput cup $i $(( C3_START - 2 ))
      echo -e "${DIM}│${RESET}"
    done
    
    # Draw Column 2 (API Logs) Header
    tput cup 1 $C2_START
    echo -e "${BOLD}${MAGENTA}API Logs (Server)${RESET}                                    "
    
    # Draw Column 3 (UI Logs) Header
    tput cup 1 $C3_START
    echo -e "${BOLD}${CYAN}UI Logs (Client)${RESET}                                      "
    
    IFS=$'\n' read -d '' -r -a API_LINES < <(tail -n "$LOG_LINES" /tmp/codraw_server.log)
    IFS=$'\n' read -d '' -r -a UI_LINES < <(tail -n "$LOG_LINES" /tmp/codraw_client.log)
    
    for (( i=0; i<LOG_LINES; i++ )); do
      ROW=$((i + 3))
      
      # Col 2
      tput cup $ROW $C2_START
      if [ $i -lt ${#API_LINES[@]} ]; then
        clean_line=$(echo "${API_LINES[$i]}" | sed 's/\x1b\[[0-9;]*m//g')
        W=$(( C2_WIDTH - 3 ))
        printf "%-${W}s" "${clean_line:0:$W}"
      else
        printf "%-$(( C2_WIDTH - 3 ))s" " "
      fi
      
      # Col 3
      tput cup $ROW $C3_START
      if [ $i -lt ${#UI_LINES[@]} ]; then
        clean_line=$(echo "${UI_LINES[$i]}" | sed 's/\x1b\[[0-9;]*m//g')
        W=$(( COLS - C3_START - 1 ))
        printf "%-${W}s" "${clean_line:0:$W}"
      else
        printf "%-$(( COLS - C3_START - 1 ))s" " "
      fi
    done
  fi

  sleep 2
done
