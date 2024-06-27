FROM node:20.15.0-slim

COPY ./src /src

WORKDIR /src

RUN npm ci

CMD [ "npm", "run", "prod"]