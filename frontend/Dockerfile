FROM --platform=linux/amd64 node:18 as build
WORKDIR /app
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend ./
RUN npm run build

FROM --platform=linux/amd64 nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
