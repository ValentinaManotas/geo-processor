FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .      
COPY tsconfig.build.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]