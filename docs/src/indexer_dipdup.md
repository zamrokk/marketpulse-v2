# Dipdup

1. Dipdup works with Python, you need to install it: https://www.python.org/downloads/

   ```bash
   curl -Lsf https://dipdup.io/install.py | python3.12
   ```

1. Install the packet manager

   ```bash
   sudo apt install pipx
   ```

1. Install dipdup CLI

   ```bash
   pipx install dipdup
   ```

1. Create the `dipdup.yaml` configuration file

   ```bash
   touch dipdup.yaml
   ```

1. Edit this file

   ```yaml
   spec_version: 3.0
   package: dipdup_indexer
   datasources:
     subsquid:
       kind: evm.subsquid
       url: https://v2.archive.subsquid.io/network/etherlink-testnet
     etherscan:
       kind: abi.etherscan
       url: https://testnet.explorer.etherlink.com/api
       api_key:
     evm_node:
       kind: evm.node
       url: https://node.ghostnet.etherlink.com
   contracts:
     marketpulse:
       kind: evm
       address: 0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a
   indexes:
     marketpulse_events:
       kind: evm.events
       datasources:
         - subsquid
         - etherscan
         - evm_node
       handlers:
         - callback: on_newbet
           contract: marketpulse
           name: NewBet
       first_level: 16297152
   ```

1. Run the default setup

   ```bash
   dipdup init
   ```

1. Move the `dipdup.yaml` inside the new `dipdup_indexer` directory

   ```bash
   mv dipdup.yaml dipdup_indexer
   ```

1. Edit `./models/__init__.py`

   ```python3
   from dipdup import fields
   from dipdup.models import Model


   class Bet(Model):
       id = fields.IntField(primary_key=True)
       owner = fields.TextField()
       option = fields.TextField()
       amount = fields.BigIntField()

       class Meta:
           maxsize = 2**18
   ```

1. Edit `./handlers/on_newbet.py`

   ```python
   from dipdup.context import HandlerContext
   from dipdup.models.evm import EvmEvent
   from dipdup_indexer import models as models
   from dipdup_indexer.types.marketpulse.evm_events.new_bet import NewBetPayload
   from tortoise.exceptions import DoesNotExist


   async def on_newbet(
       ctx: HandlerContext,
       event: EvmEvent[NewBetPayload],
   ) -> None:
       try:
           bet = await models.Bet.cached_get(pk=event.payload.id)
       except DoesNotExist:
           bet = models.Bet(
               id=event.payload.id,
               owner=event.payload.owner,
               option=event.payload.option,
               amount=event.payload.amount
           )
           bet.cache()
       await bet.save()
   ```

1. Run the indexer on memory just to check

   ```bash
   dipdup run
   ```

1. Prepare a PosgresSQL + Hasura stack for GraphQL. Add this config to `dipdup.yaml`

   ```yaml
   database:
     kind: postgres
     host: localhost
     port: 5432
     user: dipdup
     password: changeme
     database: dipdup
   hasura:
     url: http://localhost:49180
     admin_secret: changeme
     select_limit: 10000
     allow_aggregations: false
     rest: true
   ```

1. Create a local `docker-compose.yaml`

   ```bash
   touch docker-compose.yaml
   ```

1. Edit this file

   ```yaml
   version: "3.8"
   services:
     db:
       image: postgres:14
       restart: always
       ports:
         - "127.0.0.1:5432:5432"
       environment:
         - POSTGRES_USER=dipdup
         - POSTGRES_DB=dipdup
         - POSTGRES_PASSWORD=changeme
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U dipdup"]
         interval: 10s
         timeout: 5s
         retries: 5
     hasura:
       image: hasura/graphql-engine:v2.17.1
       ports:
         - "127.0.0.1:49180:8080"
       depends_on:
         - db
       restart: always
       environment:
         - HASURA_GRAPHQL_DATABASE_URL=postgres://dipdup:changeme@db:5432/dipdup
         - HASURA_GRAPHQL_ENABLE_CONSOLE=true
         - HASURA_GRAPHQL_DEV_MODE=true
         - HASURA_GRAPHQL_ENABLED_LOG_TYPES=startup, http-log, webhook-log, websocket-log, query-log
         - HASURA_GRAPHQL_ADMIN_SECRET=changeme
         - HASURA_GRAPHQL_UNAUTHORIZED_ROLE=user
         - HASURA_GRAPHQL_STRINGIFY_NUMERIC_TYPES=true
   ```

1. Run the Docker infrastructure locally on the background

   ```bash
   docker-compose up -d
   ```

1. Re-run the indexer

   ```bash
   dipdup run
   ```

1. Go to to Hasura, to query your bets once the indexers has reached 100%

   http://localhost:49180
