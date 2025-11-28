#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-https://api.github.com/markdown}"
INPUT_FILE="README.md"
OUTPUT_FILE="${INPUT_FILE%.*}.html"

declare -A OPTIONS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --input)
      INPUT_FILE="$2"; shift 2 ;;
    --output)
      OUTPUT_FILE="$2"; shift 2 ;;
    --context)
      OPTIONS["context"]="$2"; shift 2 ;;
    --mode)
      OPTIONS["mode"]="$2"; shift 2 ;;
    --)
      shift; break ;;
    -*)
      echo "Unknown option: $1" >&2; exit 1 ;;
    *)
      # positional arg
      POSITIONAL+=("$1"); shift ;;
  esac
done

if [ ! -f "$INPUT_FILE" ]; then
  printf '%s\n' "Error: input file '$INPUT_FILE' not found." >&2
  exit 2
fi

if [ ! -v "OPTIONS[mode]" ]; then
  OPTIONS["mode"]="gfm"
fi

API_HEADERS=(
    -H "Accept: application/vnd.github+json"
    -H "X-GitHub-Api-Version: 2022-11-28"
)
PAYLOAD_PARAMETERS=()
PAYLOAD_PARAMETERS_SCHEMA=("text: .")

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Enter the GitHub token to convert the GFM Markdown file to an HTML file"
  read -s GITHUB_TOKEN
fi

if [ -n "${GITHUB_TOKEN:-}" ]; then
  API_HEADERS+=(-H "Authorization: token ${GITHUB_TOKEN}")
else
  printf '%s\n' "GITHUB_TOKEN is not set. Execution may fail if rate limits are reached." >&2
fi

for key in "${!OPTIONS[@]}"; do
  value="${OPTIONS[$key]}"

  if [ -n "$value" ]; then
    PAYLOAD_PARAMETERS+=(--arg "$key" "$value")
    PAYLOAD_PARAMETERS_SCHEMA+=("${key}: \$${key}")
  fi
done

PAYLOAD_SCHEMA=$(IFS=","; printf "%s\n" "${PAYLOAD_PARAMETERS_SCHEMA[*]}")
PAYLOAD=$(jq -Rs "${PAYLOAD_PARAMETERS[@]}" "{${PAYLOAD_SCHEMA}}" "$INPUT_FILE")

if ! curl --fail -sS "${API_HEADERS[@]}" -X POST "$API_URL" -d "$PAYLOAD" --create-dirs -o "$OUTPUT_FILE"; then
    printf '%s\n' "GFM Markdown API request failed. See output above for details." >&2
    exit 7
fi

printf 'Converted %s -> %s\n' "$INPUT_FILE" "$OUTPUT_FILE"