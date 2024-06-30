FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn
RUN yarn add mongodb
RUN yarn add express
RUN yarn add cors
RUN yarn add https
RUN yarn add fs
RUN yarn add path
RUN yarn add cheerio
RUN yarn add xml2js
RUN yarn add axios
CMD ["yarn", "start"]