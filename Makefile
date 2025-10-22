include .env

NAME=template
VERSION=prod

.PHONY: *

# Default target - show help
help: ## 📋 Show this help message
	@echo ""
	@echo "╔══════════════════════════════════════════════════════════════════════════════╗"
	@echo "║                           🚀 NESTJS PROJECT MAKEFILE                        ║"
	@echo "╚══════════════════════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📋 Available Commands:"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; category=""} \
		/^##/ { \
			category = substr($$0, 4); \
			printf "\n%s:\n", category; \
			next \
		} \
		/^[a-zA-Z_-]+:.*##/ { \
			printf "  %-25s %s\n", $$1, $$2 \
		}' $(MAKEFILE_LIST)
	@echo ""
	@echo "💡 Example Usage:"
	@echo "  make start-dev                    # Start development environment"
	@echo "  make test type=int watch=true     # Run integration tests in watch mode"
	@echo "  make test-cov type=e2e json=true  # Run e2e coverage with JSON output"
	@echo "  make logs-all                     # Follow all container logs"
	@echo ""
	@echo "📝 For more information, check the README.md file"
	@echo ""

.DEFAULT_GOAL := help

## 🐳 Docker & Infrastructure
start-infra: ## Start infrastructure containers (PostgreSQL, etc.)
	@echo "==> Running infra containers"
	@docker compose --profile infra up -d

stop-infra: ## Stop infrastructure containers
	@echo "==> Stopping infra containers"
	@docker compose --profile infra down -v --remove-orphans

start-dev: export BUILD_TARGET=dev-builder
start-dev: start-infra ## Start development environment with live reload
	@echo "==> Running development containers"
	@docker compose --profile backend up --watch

stop-dev: ## Stop development environment
	@echo "==> Stopping development containers"
	@docker compose --profile full down --rmi local -v --remove-orphans

## 📊 Logs & Monitoring
logs-all: ## Follow logs from all containers
	@echo "==> Reading all compose logs together"
	@docker compose logs -f

logs-infra: ## Follow logs from infrastructure containers
	@echo "==> Reading infra logs"
	@docker compose --profile infra logs -f

## 🏗️  Build & Deploy
build: ## Build production Docker image
	@echo "==> Building Docker API image"
	@docker build --target production --rm --compress -t ${NAME}:${VERSION} .

run-network-host: build ## Run app with host networking
	@echo "==> Running Docker API image"
	@docker run --rm --env-file .env --network host --name ${NAME} -t ${NAME}:${VERSION}

run-network-compose: build start-infra ## Run app with compose networking
	@echo "==> Running Docker API image"
	@docker run --rm --env-file .env --network template-net -p ${PORT}:${PORT} --name ${NAME} -t ${NAME}:${VERSION}

## 🗄️  DB Migrations
new-migration: ## Create a new database migration (name=descriptive_name)
	@echo "==> Creating new migration: $(name)"
	@npx drizzle-kit generate --name $(name)

migrate: ## Run database migrations
	@echo "==> Running database migrations"
	@npx drizzle-kit migrate

## 🧪 Testing
test: ## Run tests (type=unt|int|e2e, watch=true for watch mode)
	@echo "==> Running $(or $(type),unt) tests"
	@TEST_TYPE=$(or $(type),unt) npm run test$(if $(filter true,$(watch)),:watch)

test-debug: ## Run tests in debug mode (type=unt|int|e2e)
	@echo "==> Running $(or $(type),unt) tests in debug mode"
	@TEST_TYPE=$(or $(type),unt) TEST_PATTERN=$(if $(filter true,$(test)),) npm run test:debug

test-cov: ## Run test coverage report (type=unt|int|e2e, json=true for JSON output)
	@echo "==> Running test coverage report"
	@TEST_TYPE=$(or $(type),unt) npm run test:cov$(if $(filter true,$(json)),:json)

## 🔧 Maintenance
clean: ## Remove Docker images
	@echo "==> Deleting Docker image"
	@docker rmi ${NAME}:${VERSION}

docker-scout: build ## Scan for vulnerabilities
	@echo "==> Search for vulnerabilities on prod image"
	@docker scout cves -e --only-fixed ${NAME}:${VERSION}