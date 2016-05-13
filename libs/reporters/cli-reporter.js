var chalk = require('chalk');
chalk.enabled = false;

function prettifyStatus (status) {
    var symbols = {
        ok: '✓',
        info: 'ℹ',
        warn: '⚠',
        err: '✖'
    };

    if (process.platform === 'win32') {
        symbols.ok = '\u221A';
        symbols.info = '\u2139';
        symbols.warn = '\u26A0';
        symbols.err = '\u00D7';
    }

    if (status.type === "SUPPORT" || status.type === "FULL_SUPPORT") {
        return chalk.green(symbols.ok);
    }

    if (status.type === "NO_SUPPORT") {
        return chalk.red(symbols.err);
    }

    if (status.type === "WARN") {
        return chalk.yellow(symbols.warn + " " + status.msg);
    }

    if (status.type === "FUTURE_SUPPORT") {
        return chalk.gray.bgBlue(symbols.info + " upcoming");
    }

    return status.type;
}

function printScriptsReport (report) {
    var out = '';
    var log = function() {
        out += Array.from(arguments).join(' ') + '\n';
    }
    Object.keys(report.used).sort().forEach(function (api) {
        log(chalk.white.bold.bgMagenta("chrome." + api));

        var apiExprs = report.used[api];

        Object.keys(apiExprs).sort().forEach(function (expr) {
            log("  ." + expr + " " + prettifyStatus(apiExprs[expr].status));

            apiExprs[expr].filesLocations.forEach(function (file) {
                log("     " + file.file);

                file.locations.forEach(function (loc) {
                    log("       - line: " + loc.line + ", col: " + loc.column);
                });
            });

            log("");
        });
    });
    return out;
}

function printManifestReport (report) {
    var out = '';
    var log = function() {
        out += Array.from(arguments).join(' ') + '\n';
    }
    report.forEach(function (manifestKey) {
        if (!(manifestKey.support instanceof Array)) {
            return log("  - " + manifestKey.key + " " + prettifyStatus(manifestKey.support));
        }

        log("  - " + manifestKey.key);

        manifestKey.support.forEach(function (support) {
            log("   " + prettifyStatus(support));
        });
    });
    return out;
}

function printReport (report) {
    var out = '';
    var log = function() {
        out += Array.from(arguments).join(' ') + '\n';
    }
    log(chalk.black.bold.bgYellow("manifest.json support"));
    log("");
    log(printManifestReport(report.manifestReport));

    log("");
    log(chalk.black.bold.bgYellow("API usage support"));
    log("");
    log(printScriptsReport(report.scriptsReport));
    return out;
}

module.exports = printReport;
