#!/bin/bash
set -e

# npm ci
npm run build
npm i --omit=dev
func azure functionapp publish pvhome-whatsapp
npm ci
