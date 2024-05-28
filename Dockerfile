FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npx prisma db push
EXPOSE 5000
CMD npm run start
