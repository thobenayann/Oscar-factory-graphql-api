# Script for linux OS (Need to be adapted for your DB)

```json
    "scripts": {
        "start": "node .",
        "initDB": "dropdb -U postgres oscar; createdb -U postgres oscar; npm run resetDB",
        "resetDB": "psql -U postgres -d oscar -f ./data/structure.sql; psql -U postgres -d oscar -f ./data/migration_favorite.sql; psql -U postgres  -d oscar -f ./data/data.sql; DEBUG=seeding node data/generateMovieSeeding.js",
        "dev": "DEBUG=*,-express*,-body-parser*,-nodemon* CACHE_ENABLED=true DATALOADER_ENABLED=true npx nodemon --ext 'js,gql'",
        "devCache": "DEBUG=*,-express*,-body-parser*,-nodemon* CACHE_ENABLED=true npx nodemon --ext 'js,gql'",
        "devDataloader": "DEBUG=*,-express*,-body-parser*,-nodemon* DATALOADER_ENABLED=true npx nodemon --ext 'js,gql'",
        "devBase": "DEBUG=*,-express*,-body-parser*,-nodemon* npx nodemon --ext 'js,gql'",
        "format": "npx prettier --write ."
    },
```
