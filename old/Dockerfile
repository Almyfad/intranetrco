FROM node:22.5.1-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=${ANGULAR_ENVIRONMENT}
FROM nginx:1.27.0-alpine
COPY --from=builder /usr/src/app/dist/intranetrco/browser /usr/share/nginx/html
