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
}

function select() {return db_data;}

function insert(data) {
    db_data.push(data);
    return data.id;
}

function update(data) {
    db_data[db_data.findIndex((el) => el.id === data.id)] = data;
    return data.id;
}

function delete_data (id) {
    let delete_index = db_data.findIndex((el) =>  el.id === id);
    let delete_row = db_data[delete_index];
    db_data.splice(delete_index, 1);
    return delete_row;
}

util.inherits(DB, ee.EventEmitter);
exports.DB = DB;