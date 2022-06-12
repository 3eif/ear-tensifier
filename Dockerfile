FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# yasha and sange dependencies
RUN apk add --no-cache \
    git \
    python3 \
    ffmpeg-dev \
    libuv-dev \
    opus-dev \
    libsodium-dev \
    libtool \
    autoconf \
    automake \
    cmake \
    make \
    protoc \
    g++ \
    gcc \
    && npm ci \
    && apk del  --no-cache \
    git \
    python3 \
    libtool \
    autoconf \
    automake \
    cmake \
    make \
    protoc \
    g++ \
    gcc

COPY . .

CMD [ "npm", "start" ]
