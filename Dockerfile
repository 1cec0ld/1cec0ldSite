FROM node:20.9.0-bookworm as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN mkdir -p nginx/certs
COPY nginx/dummy/dummy.cer nginx/certs/localhost.cer
COPY nginx/dummy/dummy.key nginx/certs/localhost.key


# Install app dependencies. 
# If the package.json and package-lock.json stays the same, Docker will use the cached version and skip npm install
COPY package*.json .

RUN npm install -g npm@latest
RUN npm install
COPY . .

RUN npm run build

FROM nginx:1.25.3-bookworm

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx /etc/nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]