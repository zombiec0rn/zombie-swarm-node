FROM node:5.7.0
#RUN npm install -g @asbjornenge/zombie-swarm-node
#ENTRYPOINT ["zombie-swarm-node"]
ADD . /app
ENTRYPOINT ["node","/app/build/index.js"]
