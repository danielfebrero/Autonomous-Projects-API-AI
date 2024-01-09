FROM node:16-alpine

# Créer un répertoire pour l'application
WORKDIR /usr/src/apapiai

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

WORKDIR /usr/src/apapiai/webapp
RUN npm install

# Exposer le port sur lequel l'application s'exécutera
EXPOSE 8080 3000

WORKDIR /usr/src/apapiai

RUN chmod +x ./docker-start.sh

# La commande pour démarrer l'application
CMD ["sh", "docker-start.sh" ]
