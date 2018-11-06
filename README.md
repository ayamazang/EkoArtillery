# EkoArtillery
Use artillery connect with `EKO` for mocking data.

## Prerequisite
- Node version 8+


## Installation
- Clone repository
- Install NPM
```
  npm install
  npm install git://github.com/karrung/artillery.git
  npm install git://github.com/karrung/artillery-core.git#feature-eko-engine
```


## Prepare prerequisite data
- Setup Auth user
  - Add auth user `prerequisite-data/creator-users.csv`

- (Optional) Set media
  - Set images into `images_example`
  - Set files into `files_example`
  - Run `node prerequisite-data/scripts/prepare-file.js`

## Run development
- Create `<script>.yml`
- (Optional) Create `processors/<script>.js`
- Run artillery
```
  ./node_modules/.bin/artillery run <script>
```

### Example
- Run artillery
```
  ./node_modules/.bin/artillery run card-create.yml
```
- Run artillery with environments
```
  ./node_modules/.bin/artillery run -e local02 card-create.yml
```

- Run artillery and keep logs
```
  ./node_modules/.bin/artillery run -e local02 card-create.yml 2>logs/local02-card-create.csv
```