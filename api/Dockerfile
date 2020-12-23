FROM node:latest
########################################
# Maintained by abnaceur@student.42.fr #
########################################
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install nodemon -g
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
CMD DEBUG=backend:* npm run devstart
