FROM node:10
# docker inspect bcc24587215d | grep '"IPAddress"' | head -n 1

#docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' bcc24587215d
WORKDIR /usr/src/app

COPY package*.json ./

#RUN npm install express
#RUN npm install body-parser
#RUN npm install cors
RUN npm install mysql
#RUN npm install md5
#RUN npm install jsonwebtoken
#RUN npm install bcryptjs
#RUN npm install node-datetime
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node","index.js"]
