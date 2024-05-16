FROM cypress/included:latest

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install
RUN cypress verify