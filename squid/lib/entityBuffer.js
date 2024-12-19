"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityBuffer = void 0;
class EntityBuffer {
    constructor() { }
    static add(e) {
        let b = this.buffer[e.constructor.name];
        if (b == null) {
            b = this.buffer[e.constructor.name] = [];
        }
        b.push(e);
    }
    static flush() {
        let values = Object.values(this.buffer);
        this.buffer = {};
        return values;
    }
}
exports.EntityBuffer = EntityBuffer;
EntityBuffer.buffer = {};
