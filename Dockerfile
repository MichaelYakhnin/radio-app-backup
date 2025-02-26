FROM node:10 as build-env
WORKDIR /app

ADD package.json .

RUN npm install

ADD . .

RUN npm run build:prod

FROM nginx:alpine

COPY --from=build-env /app/dist/radio-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
