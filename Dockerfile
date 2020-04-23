FROM alpine as alpinetz
RUN apk add --no-cache tzdata
ENV TZ=Asia/Tashkent
WORKDIR /app

FROM alpinetz as node
RUN apk add --no-cache nodejs

FROM node as npm
RUN apk add --no-cache nodejs npm
COPY package.json ./

FROM npm as dev
RUN npm install --no-cache
COPY . .
RUN npm run build

FROM npm as prod
RUN npm install --no-cache --production

FROM node
COPY --from=dev /app/dist .
COPY --from=prod /app/node_modules node_modules
EXPOSE 80
CMD ["node", "index.js"]
