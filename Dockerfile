FROM node:16-alpine

# Créer un répertoire pour l'application
WORKDIR /usr/src/backend

# Copier les fichiers 'package.json' et 'package-lock.json' (le cas échéant)
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier les fichiers et répertoires du projet
COPY . .

# Build application
RUN npm run build

# Copier les fichiers et répertoires du projet
COPY dist dist

# Exposer le port sur lequel l'application s'exécutera
EXPOSE 8080

# La commande pour démarrer l'application
CMD [ "node", "dist/index.js" ]
