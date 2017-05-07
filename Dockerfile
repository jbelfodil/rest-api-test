FROM node:6.10-alpine
EXPOSE 1337

ENV PORT 1337
ENV DB_PATH ''
ENV DB_USER ''
ENV DB_PWD ''

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install --quiet

COPY . /usr/src/app

CMD [ "npm", "start" ]
