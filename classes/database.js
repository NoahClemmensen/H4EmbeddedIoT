const mysql = require('mysql2/promise');

let config = {
    socketPath: process.env.DB_SOCKET,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

let connection = mysql.createConnection(config);

class Database {
    static async getDevices() {
        return this.query('SELECT * FROM devices');
    }

    static async getDeviceBySerial(sn) {
        return this.query('SELECT * FROM devices WHERE serial = ?', [sn]);
    }

    static async getSettings() {
        return this.query('call get_settings()');
    }

    static async saveSettings(settings) {
        return this.query('call change_settings(?,?,?,?,?,?,?,?,?)', [settings.max_temp, settings.min_temp, settings.max_fugt, settings.min_fugt, settings.temp_interval, settings.fugt_interval, settings.start_time, settings.end_time, settings.password]);
    }

    static async logTemp(temperature, time, deviceSN) {
        return this.query('call log_temp(?,?,?)', [temperature, new Date(time), deviceSN]);
    }

    static async logHumidity(humidity, time, deviceSN) {
        return this.query('call log_humidity(?,?,?)', [humidity, new Date(time), deviceSN]);
    }

    static async getClimateData(deviceSN) {
        return this.query('call get_climate_info(?)', [deviceSN]);
    }

    static async editDevice(sn, location, name, desc) {
        return this.query('call edit_device(?,?,?,?)', [sn, location, name, desc]);
    }

    static async deleteDevice(sn) {
        return this.query('call delete_device(?)', [sn]);
    }

    static async createDevice(sn, location, name, desc) {
        return this.query('call create_device(?,?,?,?)', [sn, location, name, desc]);
    }

    static async getPassword() {
        const result = await this.query('select password from settings order by id desc limit 1');
        return result[0].password;
    }

    static async query(sql, args) {
        if (connection instanceof Promise) {
            connection = await connection;
        }

        const [results, fields] = await connection.query(sql, args);
        return results;
    }
}

module.exports = Database;