# Dipdup

Install Python

curl -Lsf https://dipdup.io/install.py | python3.12

sudo apt install pipx

pipx install dipdup


create the dipdup yaml file

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
    ws_url: wss://node.ghostnet.etherlink.com

contracts:
  marketpulse:
    kind: evm
    address: 0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a
    typename: marketpulse

indexes:
  marketpulse_events:
    kind: evm.events
    datasources:
      - subsquid
      - etherscan
      - evm_node
    handlers:
      - callback: on_transfer
        contract: marketpulse
        name: Transfer
```

dipdup init

> Note, mv the dipdup yaml inside the new indexer directory


Edit **models/__init__.py**

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


Edit **handlers/on_newbet.py**

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

Run the indexer on memory just to check

dipdup run


Prepare a PosgresSQL + Hasura stack for GraphQL

Add this config to dipdup.yaml

```yaml
database:
  kind: postgres
  host: db
  port: 5432
  user: dipdup
  password: changeme
  database: dipdup
``` 

create a local docker-compose.yaml

touch docker-compose.yaml

```yaml

```

Run it

docker-compose up -d

ReRun the indexer


dipdup run


Connect to hasura

http://localhost:49180