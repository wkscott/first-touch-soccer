const backup = require('mongodb-backup');
const schedule = require('node-schedule');

const backupDB = () => {
    backup({
        uri: process.env.MONGODB_URI,
        root: './backup',
        collections: ['users', 'coaches', 'bookings', 'payments'],
        callback: (err) => {
            if (err) {
                console.error('Backup failed:', err);
            } else {
                console.log('Backup completed successfully');
            }
        }
    });
};

// Schedule daily backups
schedule.scheduleJob('0 0 * * *', backupDB);

module.exports = backupDB; 