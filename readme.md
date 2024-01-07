# apapiai

## Introduction

apapiai is a project that connects you to the most receits generative AIs and APIs.

## APIs (plug-and-play)

- puppeteer
- openAI
- yahoo finance
- dialogflow cx
- google signin
- vertex / gemini
- twitter

## Screenshot

![Project Screenshot](https://i.imgur.com/zaX2liZ.png)
![Dialogflow CX Routing](https://i.imgur.com/M2hUhRM.png)
![Project Diagram](https://i.imgur.com/Hx0h45p.png)

## Installation

To install apapiai, simply clone the repository from GitHub:

```
git clone https://github.com/apapiai/apapiai.git
```

Once you have cloned the repository, you can install the dependencies:

```
npm install
```

## Usage

1) You need to setup gcloud cli and enable many APIs, good luck

2) To use apapiai, from the root folder:

```
npm start
```

3) In another terminal:
```
cd webapp 
npm start
```

Access the app: http://localhost:3000/

You can query the API with postman on http://localhost:8080

A regular POST body contains at least: socketUuid, credential, appId. You can capture them in the dev console.

When sending a request on Postman, you will see feedback in the app if UI is running on localhost.

## Build for production

1. Ensure the directories ./dist/override and ./dist/webapp exist. Create them if not.
2. cd in webapp, then `npm run build`
3. cd root (../), then `npm run build`
4. ensure you have a app.yaml file at the root of the project (see docs, only few env variables are mandatory)
5. deploy to gcloud with `gcloud app deploy`

## Contributing

If you would like to contribute to apapiai, please fork the repository on GitHub and submit a pull request.
