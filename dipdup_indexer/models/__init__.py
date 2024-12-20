from dipdup import fields
from dipdup.models import Model


class Bet(Model):
    id = fields.IntField(primary_key=True)
    owner = fields.TextField()
    option = fields.TextField()
    amount = fields.BigIntField()

    class Meta:
        maxsize = 2**18