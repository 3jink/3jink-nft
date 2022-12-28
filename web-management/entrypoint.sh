#!/bin/bash

echo $PATH

rm .env.test && \
    echo "NODE_ENV='$NODE_ENV'" >> .env.test && \
    echo "VUE_APP_BASE_URL='$VUE_APP_BASE_URL'" >> .env.test && \
    echo "VUE_APP_MODE='$VUE_APP_MODE'" >> .env.test && \
    echo "VUE_APP_PREVIEW='$VUE_APP_PREVIEW'" >> .env.test && \
    echo "VUE_FILENAME='$VUE_FILENAME'" >> .env.test && \
    cat .env.test

yarn serve