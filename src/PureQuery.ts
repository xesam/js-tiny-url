import {type KeyType, type ValueType} from './types'

export default class PureQuery {
    private _pairs: { [key: KeyType]: ValueType[] };

    constructor(qString?: string, decodeValue = false) {
        this._pairs = Object.create(null);
        if (qString) {
            this.load(qString, decodeValue);
        }
    }

    isEmpty() {
        return Object.keys(this._pairs).length === 0;
    }

    has(key: KeyType) {
        return key in this._pairs;
    }

    keys() {
        return Object.keys(this._pairs);
    }

    get(key: KeyType, index = 0) {
        if (!this.has(key)) {
            return;
        }
        return this._pairs[key][index];
    }

    getAll(key: KeyType) {
        if (!this.has(key)) {
            return;
        }
        return this._pairs[key];
    }

    add(key: KeyType, value: ValueType) {
        if (this.has(key)) {
            if (!this._pairs[key].includes(value)) {
                this._pairs[key].push(value);
            }
        } else {
            this.set(key, value);
        }
        return this;
    }

    addAll(entries: Record<KeyType, ValueType | ValueType[]> | [KeyType, ValueType | ValueType[]][]) {
        if (Array.isArray(entries)) {
            entries.forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => this.add(key, v));
                } else {
                    this.add(key, value);
                }
            });
        } else {
            Object.entries(entries).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => this.add(key, v));
                } else {
                    this.add(key, value);
                }
            });
        }
        return this;
    }

    addIfNotExist(key: KeyType, value: ValueType) {
        if (this.has(key)) {
            return this;
        } else {
            this.set(key, value);
        }
        return this;
    }

    set(key: KeyType, ...values: ValueType[]) {
        const validValues = values.filter(ele => !!ele);
        if (!validValues.length) {
            this._pairs[key] = [''];
        } else {
            this._pairs[key] = validValues;
        }

        return this;
    }

    remove(key: KeyType) {
        delete this._pairs[key];
        return this;
    }

    clear() {
        this._pairs = Object.create(null);
        return this;
    }

    load(qString: string, decodeValue = false) {
        this.clear();
        return qString.split('&')
            .map(ele => ele.split('='))
            .forEach(([key, value]) => {
                this.add(key, decodeValue ? decodeURIComponent(value) : value);
            });
    }

    merge(otherQuery: string | PureQuery, decodeValue = false) {
        if (typeof otherQuery === 'string') {
            const newUrlQuery = new PureQuery(otherQuery, decodeValue);
            this.merge(newUrlQuery);
        } else if (otherQuery.constructor === PureQuery) {
            Object.assign(this._pairs, otherQuery._pairs);
        }
        return this;
    }

    toUrlString(encodeValue = false) {
        return Object.entries(this._pairs)
            .map(([key, values]) => {
                return values.map(value => `${key}=${encodeValue ? encodeURIComponent(value ?? '') : value}`).join('&')
            })
            .join('&')
    }

    toString() {
        return this.toUrlString();
    }
}