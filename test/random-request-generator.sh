#!/bin/bash

# URL_BASE="https://api.twoxai.online/api/text/contents"
# KEYWORDS=(
#   "sunglasses" "passion" "passenger" "classic" "giraffe" "frog" "octopus" "polar bear"
#   "penguin" "hamster" "bear" "tail" "vet" "animals" "animal care center"
#   "animal sounds in English" "animal sounds in different languages" "jacket"
#   "handle" "basket" "umbrella" "pocket" "uniform" "volunteer" "guard" "gate"
#   "superstar" "jeans" "coat" "skin" "post office" "shop" "field trip" "park"
#   "weekend" "fruit" "mouth" "nut" "goal" "sign" "happiness" "subject"
# )

# local test
URL_BASE="http://localhost:3200/api/text/contents"
KEYWORDS=(
  "baseball" "harry potter" "global warming" "major league baseball" "premier league"
  "pyramid" "intellectual property" "pride and prejudice" "artificial intelligence"
)

TYPE="selected"

TOKENS=(
  ""
  ""
)

LEVELS=("low" "middle" "high")

REQUEST_COUNT=40
SUCCESS_LOG="requests_output.txt"
ERROR_LOG="error_output.txt"

echo "" > "$SUCCESS_LOG"
echo "" > "$ERROR_LOG"

make_request() {
  local i=$1
  local KEYWORD=${KEYWORDS[$((RANDOM % ${#KEYWORDS[@]}))]}
  local LEVEL=${LEVELS[$((RANDOM % ${#LEVELS[@]}))]}
  local TOKEN=${TOKENS[$((RANDOM % ${#TOKENS[@]}))]}
  local URL="$URL_BASE/$LEVEL?type=$TYPE"
  local TMP_RESPONSE=$(mktemp)

  HTTP_STATUS=$(curl -s -w "%{http_code}" -o "$TMP_RESPONSE" \
    -X POST "$URL" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"keyword\": \"$KEYWORD\"}"
  )

  if [[ "$HTTP_STATUS" -ge 200 && "$HTTP_STATUS" -lt 300 ]]; then
    {
      echo "[$i/$REQUEST_COUNT] ✅ SUCCESS"
      echo "Keyword: $KEYWORD"
      echo "Level: $LEVEL"
      echo "Status: $HTTP_STATUS"
      # cat "$TMP_RESPONSE"
      echo -e "--------------------------\n"
    } >> "$SUCCESS_LOG"
  else
    {
      echo "[$i/$REQUEST_COUNT] ❌ FAILED"
      echo "Keyword: $KEYWORD"
      echo "Level: $LEVEL"
      echo "Status: $HTTP_STATUS"
      cat "$TMP_RESPONSE"
      echo -e "--------------------------\n"
    } >> "$ERROR_LOG"
  fi

  rm "$TMP_RESPONSE"
}

for ((i = 1; i <= REQUEST_COUNT; i++)); do
  make_request "$i" &
done

wait

echo "Parallel test completed"
echo "Success in $SUCCESS_LOG"
echo "Failed in $ERROR_LOG"