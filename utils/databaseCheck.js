const checkDatabase = async () => {
    return {
        connection: await testDatabaseConnection(),
        backups: verifyBackupSystem(),
        indexes: await verifyIndexes(),
        performance: await checkDBPerformance(),
        dataIntegrity: await verifyDataIntegrity()
    };
}; 