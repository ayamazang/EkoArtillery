# EkoArtillery


# Prerequisite
- Node version 8+


# Installation
- Clone
- Run
	npm install
	npm install git://github.com/karrung/artillery.git
	npm install git://github.com/karrung/artillery-core.git#feature-eko-engine


# Development
- Prepare `prerequisite-data`
	- run `node prerequisite-data/scripts/prepare-file.js`
	- set up auth user `prerequisite-data/creator-users.csv`
- Run artillery
	./node_modules/.bin/artillery run <script>

## Example
- Run artillery with environments
	./node_modules/.bin/artillery run -e local02 card-create.yml
- Run artillery and keep logs
	./node_modules/.bin/artillery run -e local02 card-create.yml 2>logs/local02-card-create.csv