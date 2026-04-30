FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# installer ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

CMD ["node", "index.js"]
