FROM node:19.3.0

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./

RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version stable

RUN yarn install

COPY . .

EXPOSE 3001

CMD [ "yarn", "dev" ]