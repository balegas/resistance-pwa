import Parse from "parse";
import {DBError} from "./BaseRepository";
import ParseError from "parse/lib/react-native/ParseError";

export default class ParseDriver {
    constructor({appId, masterKey, serverURL, classes}) {
        this.appId = appId;
        this.masterKey = masterKey;
        this.serverURL = serverURL;
        this.classes = classes;
        this.objects = [];
        this.subscriptions = {};
    }

    connect() {
        Parse.serverURL = this.serverURL;
        Parse.initialize(this.appId, this.masterKey);
        this.classes.forEach(({className, classProps}) => {
            let object = Parse.Object.extend(className, classProps);
            this.objects.push(object);
        });
    }

    testConnection() {
        if (this.classes.length === 0) {
            this.connected = {success: false, error: new DBError(NO_OBJECTS_DEFINED)};
            return Promise.reject(new DBError(NO_OBJECTS_DEFINED));
        }
        let object = new this.objects[0]();
        return object.save()
            .then(retObj => retObj.destroy())
            .then(() => true)
            .catch(err => Promise.reject(new DBError(WRAPPED_ERROR, err)));
    }

    save(jsonValue, type) {
        let {success, value, error} = this.json_to_object(jsonValue, type);
        if (!success) {
            return Promise.reject(error);
        }
        return this.saveObject(value)
            .then(object => this.object_to_json(object));
    }

    update(key, valueJson, type) {
        !valueJson.objectId && (valueJson.objectId = key);
        if (valueJson.objectId !== key) {
            return Promise.reject(new DBError(KEY_VALUE_MISMATCH))
        }
        let {success, value, error} = this.json_to_object(valueJson, type);

        if (!success) {
            return Promise.reject(error);
        }
        return this.saveObject(value, key);
    }

    get(key, type) {
        return this.getInternal(key, type)
            .then(value => this.object_to_json(value))
            .catch(error => Promise.reject(error))
    }


    //TODO: hacky list method
    list(type, limit = 10) {
        const query = new Parse.Query(type);
        query.limit(limit);
        return query.find()
            .then(res => res.map(r => this.object_to_json(r)))
    }

    delete(key, type) {
        return this.getInternal(key, type)
            .then(value =>
                value.destroy()
                    .then(() => true)
                    .catch(error => Promise.reject(new DBError(error))))
            .catch(error => Promise.reject(error))
    }

    getInternal(key, type) {
        let idx = this.classes.findIndex(elem => elem.className === type);
        if (idx === -1) {
            return Promise.reject(new DBError(OBJECT_TYPE_NOT_DEFINED, [type]));
        }
        let query = new Parse.Query(type);
        return query.get(key)
            .then(object => object)
            .catch(error =>
                Promise.reject(this.translateError(error)));
    }

    subscribe(key, type, handlers) {
        let query = new Parse.Query(type);
        query.equalTo('objectId', key);

        let objToJson = (obj) => this.object_to_json(obj);

        let registerHandlers = (subscription) => {
            Object.keys(handlers)
                .forEach(eventName => {
                    subscription.on(eventName, (obj) => handlers[eventName](objToJson(obj)));
                });
        };

        return query.subscribe()
            .then((subscription) => {
                this.subscriptions[key] = subscription;
                registerHandlers(subscription)
            });
    }


    saveObject(object, key) {
        return object.save(key)
            .then(obj => obj)
            .catch(err => Promise.reject(new DBError(WRAPPED_ERROR, err)));
    }

    json_to_object(json, type) {
        let idx = this.classes.findIndex(elem => elem.className === type);
        if (idx === -1) {
            return {success: false, error: new DBError(OBJECT_TYPE_NOT_DEFINED, [type])};
        }
        let object = new this.objects[idx]();
        object.set(json);
        return {success: true, value: object};
    }

    object_to_json(object) {
        return object.toJSON();
    }

    translateError(error) {
        let code = error.code && ERROR_MAP[error.code] ? ERROR_MAP[error.code] : undefined;
        return new DBError(WRAPPED_ERROR, [error], code);
    }
}


const NO_OBJECTS_DEFINED = () => "Parse server was initialized without any object class";
const KEY_VALUE_MISMATCH = () => "Object id does not match id. Maybe trying to write a new object?";
const OBJECT_TYPE_NOT_DEFINED = (arg0) => "Object type: " + arg0 + " not defined";
const WRAPPED_ERROR = (arg0) => `Internal error: ${arg0}`;


export const NO_OBJECT_ERROR = 0x000001;

const ERROR_MAP = {[ParseError.OBJECT_NOT_FOUND]: NO_OBJECT_ERROR};
