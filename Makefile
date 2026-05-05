VENV=.venv/Scripts/Activate.ps1
PY=python

.PHONY: start-dev start-stable docker-up docker-down build-image

start-dev:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "& $(VENV); .\start-dev.ps1"

start-stable:
	@powershell -NoProfile -ExecutionPolicy Bypass -Command "& $(VENV); .\start-stable.ps1"

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down -v

build-image:
	docker build -t goflex-housing .
