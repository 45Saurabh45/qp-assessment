FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g ts-node typescript

COPY ./src ./src

EXPOSE 3000

CMD ["ts-node", "src/index.ts"]
