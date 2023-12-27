FROM node:20.9.0-bookworm as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies. 
# If the package.json and package-lock.json stays the same, Docker will use the cached version and skip npm install
COPY package*.json .

RUN npm install -g npm@latest
RUN npm install --omit=dev

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]