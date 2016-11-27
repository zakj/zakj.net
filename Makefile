serve:
	lektor server -f webpack

build:
	lektor build -f webpack

deploy: build
	surge `lektor project-info --output-path` zakj.net

.PHONY: build deploy serve
