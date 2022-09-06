FROM alpine:latest

# Set working directory.
RUN mkdir /app
WORKDIR /app

# Copy app dependencies.
COPY package.json package-lock.json /app/

RUN apk add --update nodejs npm

# Install app dependencies.
RUN npm install

# Install angular
RUN	npm install -g @angular/cli

# Copy app files.
COPY . /app

ENTRYPOINT ["sh", "-c", "ng build --outputHashing=none --output-path=${STATIC_FILES_DIRS}"]

