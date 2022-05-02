# Script for windows OS (Need to be adapted for your DB)

```json
  "scripts": {
    "initDB": "dropdb -U postgres -p 5433 oscar-factory-db; createdb -U postgres -p 5433 oscar-factory-db; npm run resetDB",
    "resetDB": "psql -U postgres -p 5433 -d oscar-factory-db -f ./data/structure.sql; psql -U postgres -p 5433 -d oscar-factory-db -f ./data/migration_favorite.sql; psql -U postgres -p 5433 -d oscar-factory-db -f ./data/data.sql; @powershell $env:DEBUG=seeding node data/generateMovieSeeding.js",
    "dev": "@powershell $env:DEBUG='*,-nodemon*,-express*,-body-parser*'; npx nodemon -e js,gql",
    "devCache": "@powershell $env:DEBUG=*,-express*,-body-parser*,-nodemon* CACHE_ENABLED=true npx nodemon --ext 'js,gql'",
    "devDataloader": "@powershell $env:DEBUG='*,-express*,-body-parser*,-nodemon* DATALOADER_ENABLED=true'; npx nodemon --ext 'js,gql'",
    "devBase": "@powershell $env:DEBUG=*,-express*,-body-parser*,-nodemon* npx nodemon --ext 'js,gql'",
    "format": "npx prettier --write ."
  },
```
