FROM node:10-buster
WORKDIR /app/frontend
COPY . /app/frontend
RUN apt-get update

RUN yarn global add @angular/cli@latest
RUN yarn install
