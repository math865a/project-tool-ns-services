 # base node image
FROM node:19-alpine3.16 as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

ADD package.json .npmrc tsconfig*.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
ADD package.json .npmrc tsconfig*.json ./
RUN npm prune --production

# Build the app
FROM base as build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build project-management

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /app

COPY --from=production-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY package*.json ./
CMD ["npm", "run", "project-management:prod"]