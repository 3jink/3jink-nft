#!/bin/bash

echo $PATH

rm .env.dev && \
    echo "NODE_ENV='$NODE_ENV'" >> .env.dev && \
    echo "VUE_APP_BASE_URL='$VUE_APP_BASE_URL'" >> .env.dev && \
    echo "VUE_APP_MODE='$VUE_APP_MODE'" >> .env.dev && \
    echo "VUE_APP_PREVIEW='$VUE_APP_PREVIEW"'' >> .env.dev && \
    echo "VUE_FILENAME='$VUE_FILENAME'" >> .env.dev && \
    cat .env.dev

yarn serve