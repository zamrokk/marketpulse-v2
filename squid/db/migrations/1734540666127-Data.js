module.exports = class Data1734540666127 {
    name = 'Data1734540666127'

    async up(db) {
        await db.query(`CREATE TABLE "block" ("id" character varying NOT NULL, "number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_38414873c187a3e0c7943bc4c7" ON "block" ("number") `)
        await db.query(`CREATE INDEX "IDX_5c67cbcf4960c1a39e5fe25e87" ON "block" ("timestamp") `)
        await db.query(`CREATE TABLE "transaction" ("id" character varying NOT NULL, "block_number" integer, "block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "hash" text NOT NULL, "to" text, "from" text, "status" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_2d99bb5a0ab5fb8cf8b746eb39" ON "transaction" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_bf7f889412fc52430b609e70b4" ON "transaction" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_de4f0899c41c688529784bc443" ON "transaction" ("hash") `)
        await db.query(`CREATE INDEX "IDX_1713783ebe978fa2ae9654e4bb" ON "transaction" ("to") `)
        await db.query(`CREATE INDEX "IDX_290df3897fac99713afb5f3d7a" ON "transaction" ("from") `)
        await db.query(`CREATE INDEX "IDX_63f749fc7f7178ae1ad85d3b95" ON "transaction" ("status") `)
        await db.query(`CREATE TABLE "contract_event_new_bet" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "transaction_hash" text NOT NULL, "contract" text NOT NULL, "event_name" text NOT NULL, "bet" jsonb NOT NULL, CONSTRAINT "PK_a94c5d9b7ca6f230dd3ddeb227f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_eb32613d657acae164720557e9" ON "contract_event_new_bet" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_6162453ee4993bb411ee9185b8" ON "contract_event_new_bet" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_e7570739755ffd572616190126" ON "contract_event_new_bet" ("transaction_hash") `)
        await db.query(`CREATE INDEX "IDX_c475f115aa4259699e5e0fe988" ON "contract_event_new_bet" ("contract") `)
        await db.query(`CREATE INDEX "IDX_9c9b17eda6e2ebdd7d2c74c7f7" ON "contract_event_new_bet" ("event_name") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "block"`)
        await db.query(`DROP INDEX "public"."IDX_38414873c187a3e0c7943bc4c7"`)
        await db.query(`DROP INDEX "public"."IDX_5c67cbcf4960c1a39e5fe25e87"`)
        await db.query(`DROP TABLE "transaction"`)
        await db.query(`DROP INDEX "public"."IDX_2d99bb5a0ab5fb8cf8b746eb39"`)
        await db.query(`DROP INDEX "public"."IDX_bf7f889412fc52430b609e70b4"`)
        await db.query(`DROP INDEX "public"."IDX_de4f0899c41c688529784bc443"`)
        await db.query(`DROP INDEX "public"."IDX_1713783ebe978fa2ae9654e4bb"`)
        await db.query(`DROP INDEX "public"."IDX_290df3897fac99713afb5f3d7a"`)
        await db.query(`DROP INDEX "public"."IDX_63f749fc7f7178ae1ad85d3b95"`)
        await db.query(`DROP TABLE "contract_event_new_bet"`)
        await db.query(`DROP INDEX "public"."IDX_eb32613d657acae164720557e9"`)
        await db.query(`DROP INDEX "public"."IDX_6162453ee4993bb411ee9185b8"`)
        await db.query(`DROP INDEX "public"."IDX_e7570739755ffd572616190126"`)
        await db.query(`DROP INDEX "public"."IDX_c475f115aa4259699e5e0fe988"`)
        await db.query(`DROP INDEX "public"."IDX_9c9b17eda6e2ebdd7d2c74c7f7"`)
    }
}
