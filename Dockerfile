FROM node

# Create app directory
RUN mkdir -p /home/Service
WORKDIR /home/Service

# Bundle app source
COPY . .
RUN npm install

EXPOSE 3002
CMD [ "node", "app.js" ]