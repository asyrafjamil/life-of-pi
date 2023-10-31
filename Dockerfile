FROM node:14.17

# We have to install nodemon globally before moving into the working directory
RUN npm install -g nodemon

WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app

CMD [ "npm", "run", "start" ]

EXPOSE 3000
