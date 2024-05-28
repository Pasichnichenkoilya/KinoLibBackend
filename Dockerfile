FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma init
RUN npx prisma migrate deploy
EXPOSE 5000
CMD npm run start
