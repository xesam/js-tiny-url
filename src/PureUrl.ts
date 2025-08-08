import url from '@xesam/url';
import PureQuery from './PureQuery';
import {type KeyType, type ValueType} from './types'

type AttrHandle = (value: string) => string | null;

export default class PureUrl {
    private readonly _components: { [key: string]: string };
    readonly query: PureQuery;

    constructor(href?: string) {
        this._components = {};
        this.query = new PureQuery();
        if (typeof href === 'string') {
            const url_components = url(href);
            this.protocol(url_components.protocol);
            this.auth(url_components.auth);
            this.host(url_components.host);
            this.pathname(url_components.pathname);
            this.search(url_components.search);
            this.hash(url_components.hash);
        }
    }

    _attr_(key: KeyType, fn: AttrHandle | null, ...args: ValueType[]): string | this {
        if (arguments.length <= 2) {
            return this._components[key];
        }
        let value = args[0];
        if (!value) {
            delete this._components[key];
            return this;
        }
        value = String(value).trim();
        if (fn) {
            value = fn(value);
        }
        if (!value) {
            delete this._components[key];
        } else {
            this._components[key] = value;
        }
        return this;
    }

    protocol(value?: ValueType): string | this {
        return this._attr_.call(
            this,
            'protocol',
            function (value: ValueType): string | null {
                if (!value) {
                    return null;
                }
                value = value.toString().replace(/[:\/]/g, '');
                if (value.length) {
                    return value + ':';
                }
                return null;
            },
            ...arguments
        );
    }

    auth(value?: ValueType): string | undefined | this {
        if (!arguments.length) {
            if (this.username()) {
                if (this.password()) {
                    return `${this.username()}:${this.password()}`;
                } else {
                    return this.username();
                }
            } else {
                if (this.password()) {
                    return `:${this.password()}`;
                } else {
                    return undefined;
                }
            }
        }
        if (!value) {
            this.username(null);
            this.password(null);
            return this;
        }
        value = String(value).trim();
        const [username, password] = value.split(':');
        this.username(username);
        this.password(password);
        return this;
    }

    username(value?: ValueType): string | this {
        return this._attr_.call(this, 'username', null, ...arguments);
    }

    password(value?: ValueType): string | this {
        return this._attr_.call(this, 'password', null, ...arguments);
    }

    host(value?: ValueType): string | undefined | this {
        if (!arguments.length) {
            if (this.hostname()) {
                if (this.port()) {
                    return `${this.hostname()}:${this.port()}`;
                } else {
                    return this.hostname();
                }
            } else {
                if (this.port()) {
                    return `:${this.port()}`;
                } else {
                    return undefined;
                }
            }
        }
        if (!value) {
            this.hostname(null);
            this.port(null);
            return this;
        }
        value = String(value).trim();
        const [hostname, port] = value.split(':');
        this.hostname(hostname);
        this.port(port);
        return this;
    }

    hostname(value?: ValueType): string | this {
        return this._attr_.call(this, 'hostname', null, ...arguments);
    }

    port(value?: ValueType): string | this {
        return this._attr_.call(this, 'port', null, ...arguments);
    }

    path(value?: ValueType): string | undefined | this {
        if (!arguments.length) {
            if (this.pathname()) {
                if (this.search()) {
                    return `${this.pathname()}${this.search()}`;
                } else {
                    return this.pathname();
                }
            } else {
                if (this.search()) {
                    return `${this.search()}`;
                } else {
                    return undefined;
                }
            }
        }
        if (!value) {
            this.pathname(null);
            this.search(null);
            return this;
        }
        value = String(value).trim();
        const searchStart = value.indexOf('?');
        if (searchStart !== -1) {
            const pathname = value.substring(0, searchStart);
            this.pathname(pathname);
            const search = value.substring(searchStart);
            this.search(search);
        } else {
            this.pathname(value);
            this.search(null);
        }
        return this;
    }

    pathname(value?: ValueType): string | this {
        return this._attr_.call(this, 'pathname', function (value: string): string {
            if (!value.startsWith('/')) {
                value = '/' + value;
            }
            return value;
        }, ...arguments);
    }

    pathnames(...fragments: ValueType[]): string[] | this {
        if (fragments.length === 0) {
            const pathname: string = this.pathname() as string;
            if (!pathname) {
                return [];
            }
            const fragments = pathname.split('/');
            fragments.shift();
            return fragments;
        } else {
            fragments = fragments.filter((ele) => {
                return ele && ele.toString().trim().length !== 0;
            });
            this.pathname(fragments.join('/'));
            return this;
        }
    }

    search(value?: ValueType): string | undefined | this {
        if (!arguments.length) {
            if (!this.query || this.query.isEmpty()) {
                return;
            } else {
                return '?' + this.query.toUrlString();
            }
        }
        if (!value) {
            this.query.clear();
            return this;
        }
        value = String(value).trim().replaceAll('?', '');
        if (value.length === 0) {
            this.query.clear();
            return this;
        }
        this.query.load(value);
        return this;
    }

    hash(value?: ValueType): string | this {
        return this._attr_.call(this, 'hash', function (value: string): string | null {
            if (!value.startsWith('#')) {
                value = '#' + value;
            }
            if (value === '#') {
                return null;
            } else {
                return value;
            }
        }, ...arguments);
    }

    toUrlString(): string {
        const segments: string[] = [];
        if (this.hash()) {
            segments.unshift(this.hash() as string);
        }
        if (this.path()) {
            segments.unshift(this.path() as string);
        }
        if (this.host()) {
            segments.unshift(this.host() as string);
        }
        if (this.auth()) {
            segments.unshift('@');
            segments.unshift(this.auth() as string);
        }
        if (this.host() || this.auth()) {
            segments.unshift('//');
        }
        if (this.protocol()) {
            segments.unshift(this.protocol() as string);
        }
        return segments.join('');
    }

    toString(): string {
        return this.toUrlString();
    }
}