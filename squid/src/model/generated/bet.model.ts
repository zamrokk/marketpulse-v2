import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Bet {
    constructor(props?: Partial<Bet>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    owner!: string

    @StringColumn_({nullable: false})
    option!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
