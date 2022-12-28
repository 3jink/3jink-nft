FROM node:14-bullseye

ENV NODE_ENV = 'development'
ENV VUE_APP_MODE="production"
ENV VUE_APP_PREVIEW="true"
ENV VUE_APP_BASE_URL=""
ENV VUE_FILENAME="/"


WORKDIR /app

COPY ./ /app/

RUN yarn config set registry https://registry.npm.taobao.org --global && yarn config set disturl https://npm.taobao.org/dist --global
RUN yarn add @vue/cli-service@^4.0.4
RUN yarn install

RUN rm ./entrypoint.sh && \
echo "#!/bin/bash" >> ./entrypoint.sh && \
echo "rm .env.test && \ " >> ./entrypoint.sh && \
echo "echo \"NODE_ENV='$NODE_ENV'\" >> .env.test && \ " >> ./entrypoint.sh && \
echo "echo \"VUE_APP_BASE_URL='$VUE_APP_BASE_URL'\" >> .env.test && \ " >> ./entrypoint.sh && \
echo "echo \"VUE_APP_MODE='$VUE_APP_MODE'\" >> .env.test && \ " >> ./entrypoint.sh && \
echo "echo \"VUE_APP_PREVIEW='$VUE_APP_PREVIEW'\" >> .env.test && \ " >> ./entrypoint.sh && \
echo "echo \"VUE_FILENAME='$VUE_FILENAME'\" >> .env.test && \ " >> ./entrypoint.sh && \
echo "cat .env.test" >> ./entrypoint.sh && \
echo "yarn serve" >> ./entrypoint.sh && \
chmod +x ./entrypoint.sh

EXPOSE 8080

CMD ["./entrypoint.sh"]
