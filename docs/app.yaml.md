runtime: nodejs20
instance_class: F4

env_variables:
  PORT: 8080
  OPENAI_API_KEY_2:
  TWITTER_BEARER_TOKEN: 
  TWITTER_ACCESS_TOKEN: 
  TWITTER_ACCESS_SECRET: 
  TWITTER_APP_KEY: 
  TWITTER_APP_SECRET: 
  TWITTER_CLIENT_ID: 
  TWITTER_CLIENT_SECRET: 
  TWITTER_CALLBACK_URL: 
  PROXY_SERVER_URL: 
  PROXY_SERVER_CREDENTIALS:

handlers:
- url: /.*
  secure: always
  redirect_http_response_code: 301
  script: auto

network:
  session_affinity: true
