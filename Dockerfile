####################
###  BASE Stage  ###
####################
FROM node:24.10.0-trixie-slim AS base

WORKDIR /app
RUN chown node:node /app && \
    DEBIAN_FRONTEND=noninteractive apt -qq update && apt -qq upgrade -y && \
    apt -qq install --no-install-recommends dumb-init procps -y

########################
### PROD BUILD Stage ###
########################
FROM base AS builder

COPY . .
RUN npm ci
RUN npm run build

#######################
### DEV BUILD Stage ###
#######################
FROM base AS dev-builder

COPY --chown=1000:1000 package*.json ./
RUN npm ci
USER 1000

##################
### PROD Stage ###
##################
FROM base AS production

ENV NODE_ENV=production
COPY --from=builder /app/package*.json .
RUN npm prune --omit=dev
COPY --from=builder --chown=node:node /app/dist dist
USER node

CMD ["dumb-init", "node", "dist/main"]