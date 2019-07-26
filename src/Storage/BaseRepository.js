export default class BaseRepository {
    constructor(dbImpl) {
        this.dbImpl = dbImpl;
        this.connect(dbImpl);
        this.connected = false;
    }

    connect({driver, params}) {
        this.driver = new driver(params);
        this.driver.connect();
    }

    testConnection() {
        return this.driver.testConnection()
            .then(() => this.connected = true)
            .catch(e => Promise.reject(e));
    }

    save(value, type) {
        if (!value) {
            return Promise.reject(new DBError(INVALID_VALUE));
        }
        if (!type) {
            return Promise.reject(new DBError(INVALID_KEY_OR_TYPE));
        }
        if (this.connected) {
            return this.driver.save(value, type);
        }
    }

    //TODO: change preconditions
    get(key, type) {
        if (!key || !type) {
            return Promise.reject(new DBError(INVALID_KEY_OR_TYPE))
        }
        return this.driver.get(key, type)
    }

    update(key, value, type) {
        if (!key || !type) {
            return Promise.reject(new DBError(INVALID_KEY_OR_TYPE))
        }
        if (!type) {
            return Promise.reject(new DBError(INVALID_KEY_OR_TYPE));
        }
        return this.driver.update(key, value, type)
    }

    delete(key, type) {
        if (!key || !type) {
            return Promise.reject(new DBError(INVALID_KEY_OR_TYPE))
        }
        return this.driver.delete(key, type)
    }

    subscribe(key, type, handlers) {
        if (!key || !type || !handlers) {
            return Promise.reject(new DBError(INVALID_KEY_OR_TYPE))
        }
        return this.driver.subscribe(key, type, handlers);
    }
}

export class DBError {
    constructor(error, args, code) {
        this.error = error.call(error, args);
        this.name = 'DBError';
        this.args = args;
        this.code = code;
    }

    toString() {
        return this.name + ": " + this.error + (this.code ? " Code: " + this.code : '');
    }
}


const INVALID_KEY_OR_TYPE = () => "Please check the provided key or type";
const INVALID_VALUE = (arg0) => `Must provide a valid object ${arg0}`;
