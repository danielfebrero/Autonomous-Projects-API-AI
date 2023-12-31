# apapiai

## Introduction

apapiai is a project that allows you to create and manage your own virtual agents. With apapiai, you can create agents that can answer your questions, help you with tasks, and even play games with you.

## APIs (plug-and-play)

- puppeteer
- openAI
- yahoo finance
- dialogflow cx
- google signin
- vertex / gemini
- twitter

## Features

apapiai offers a variety of features (as a developer), including:

- The ability to create and manage your own virtual agents
- The ability to train your agents to answer your questions and help you with tasks
- The ability to play games with your agents

apapiai offers a variety of features (as a user), including:
- Automatize tasks and projects
- The ability to play games with your agents

## Screenshot

![Project Screenshot](https://i.imgur.com/FtM03pG.png)
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

When sending a reauest on Postman, you will see feedback in the app if UI is running on localhost.

## Contributing

If you would like to contribute to apapiai, please fork the repository on GitHub and submit a pull request.
