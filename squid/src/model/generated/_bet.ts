import assert from "assert"
import * as marshal from "./marshal"

export class Bet {
    private _id!: string
    private _owner!: string
    private _option!: string
    private _amount!: bigint

    constructor(props?: Partial<Omit<Bet, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._id = marshal.id.fromJSON(json.id)
            this._owner = marshal.string.fromJSON(json.owner)
            this._option = marshal.string.fromJSON(json.option)
            this._amount = marshal.bigint.fromJSON(json.amount)
        }
    }

    get id(): string {
        assert(this._id != null, 'uninitialized access')
        return this._id
    }

    set id(value: string) {
        this._id = value
    }

    get owner(): string {
        assert(this._owner != null, 'uninitialized access')
        return this._owner
    }

    set owner(value: string) {
        this._owner = value
    }

    get option(): string {
        assert(this._option != null, 'uninitialized access')
        return this._option
    }

    set option(value: string) {
        this._option = value
    }

    get amount(): bigint {
        assert(this._amount != null, 'uninitialized access')
        return this._amount
    }

    set amount(value: bigint) {
        this._amount = value
    }

    toJSON(): object {
        return {
            id: this.id,
            owner: this.owner,
            option: this.option,
            amount: marshal.bigint.toJSON(this.amount),
        }
    }
}
