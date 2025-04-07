#!/bin/bash

set -e

SECRET_NAME=backend-env
NAMESPACE=default

echo "apiVersion: v1
kind: Secret
metadata:
  name: ${SECRET_NAME}
  namespace: ${NAMESPACE}
type: Opaque
data:" > backend-env.yaml

while IFS='=' read -r key value || [[ -n "$key" ]]
do
  if [[ -n "$key" && ! "$key" =~ ^# ]]; then
    # ⭐ 去除掉最外層的雙引號（只去除最外層）
    clean_value=$(echo "$value" | sed -E 's/^"(.*)"$/\1/')
    encoded_value=$(echo -n "$clean_value" | base64 -w 0)

    if [[ "$key" =~ [^a-zA-Z0-9_] ]]; then
      echo "  \"$key\": \"$encoded_value\"" >> backend-env.yaml
    else
      echo "  $key: \"$encoded_value\"" >> backend-env.yaml
    fi
  fi
done < ./backend/.env

echo "✅ backend-env.yaml 生成完成"
