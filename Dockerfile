FROM node:20-alpine3.17

COPY package.json /app/
COPY src/ /app/src

WORKDIR /app/

RUN npm i

EXPOSE 3000

CMD npm start