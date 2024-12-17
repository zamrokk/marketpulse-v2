module.exports = class Data1734428598543 {
    name = 'Data1734428598543'

    async up(db) {
        await db.query(`CREATE TABLE "bet" ("id" character varying NOT NULL, "owner" text NOT NULL, "option" text NOT NULL, "amount" numeric NOT NULL, CONSTRAINT "PK_4ceea2cdef435807614b8e17aed" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "bet"`)
    }
}
