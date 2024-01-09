FROM node:16-alpine as dev
WORKDIR /usr/src/apapiai
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY dist dist
WORKDIR /usr/src/apapiai/webapp
RUN npm install
EXPOSE 8080 3000
WORKDIR /usr/src/apapiai
RUN chmod +x ./docker-start.sh
CMD ["sh", "docker-start.sh" ]

FROM node:16-alpine as prod
WORKDIR /usr/src/apapiai
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY dist dist
WORKDIR /usr/src/apapiai/webapp
RUN npm install
RUN npm run build
WORKDIR /usr/src/apapiai
EXPOSE 8080
CMD ["node", "dist/index.js" ]
