FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install bcrypt
RUN npm install jsonwebtoken

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]