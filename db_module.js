const util = require('util');
const ee = require('events');

let db_data = [
    {id: 1, name: 'James Johnson', bday: '2000-01-09'},
    {id: 2, name: 'Jack Harrison', bday: '1995-05-24'},
    {id: 3, name: 'Marie Hamilton', bday: '1997-04-20'}
];

function DB() {
    this.get = (callback) => {
        let result = select();
        process.nextTick(() => callback (result));
    };
    this.post = (data, callback) => {
        let result = insert(data);
        process.nextTick(() =>  callback(result));
    };
    this.put = (data, callback) => {
        let result = update(data);
        process.nextTick(() => callback(result))
    };
    this.delete = (id, callback) => {
        let result = delete_data(id);
        process.nextTick(() => callback(result))
    };
    this.commit = (callback) => {
        process.nextTick(() => callback())
    };
}

function select() {return db_data;}

function insert(data) {
    db_data.push(data);
    return data;
}

function update(data) {
    let update_index = db_data.findIndex((el) => el.id === data.id);
    if (update_index != -1) {
        db_data[update_index] = data;
        return data;
    } else
        return JSON.parse('{"error": "record with such index doesn\'t exist"}');
}

function delete_data (id) {
    let delete_index = db_data.findIndex((el) =>  el.id === id);
    if(delete_index != -1) {
        let delete_row = db_data[delete_index];
        db_data.splice(delete_index, 1);
        return delete_row;
    } else
        return JSON.parse('{"error": "record with such index doesn\'t exist"}');
}

util.inherits(DB, ee.EventEmitter);
exports.DB = DB;