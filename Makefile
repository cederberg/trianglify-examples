PATH  := $(shell brew --prefix node@20 2>/dev/null)/bin:$(PATH)
COUNT := 1

.PHONY: all setup clean install run

all:
	@echo '🌈 Makefile commands'
	@grep -E -A 1 '^#' Makefile | awk 'BEGIN { RS = "--\n"; FS = "\n" }; { sub("#+ +", "", $$1); sub(":.*", "", $$2); printf " · make %-18s- %s\n", $$2, $$1}'
	@echo
	@echo '🚀 Quick start'
	@echo ' · make COUNT=10 run      - Generate 10 examples'


# Clean generated files and node_modules
clean:
	rm -rf generated-files/ node_modules/
	rm -rf ~/.node-gyp ~/Library/Caches/node-gyp

# Install project dependencies
install:
	npm install

# Generate examples
run:
	node start.js $(COUNT)
