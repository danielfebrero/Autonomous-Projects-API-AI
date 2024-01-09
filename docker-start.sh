#!/bin/bash

# Démarrer le premier processus en arrière-plan
node dist/index.js &

# Démarrer le deuxième processus en premier plan
cd webapp && npm start
