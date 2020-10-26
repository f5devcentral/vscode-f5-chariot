import { OutputChannel, window } from 'vscode';

import { inspect } from 'util';


class Log {
    private readonly _outputChannel: OutputChannel;
    public constructor() {
        this._outputChannel = window.createOutputChannel('f5-chariot');
        this._outputChannel.show();
    }

    async makeVisible () {
        return this._outputChannel.show(true);
    }

    /**
     * preferred method for logggin at this time
     * @param msg 
     */
    debug(...msg: [unknown, ...unknown[]]): void {
        this.write('DEBUG', ...msg);
    }
    
    warning(...msg: [unknown, ...unknown[]]): void {
        this.write('ERROR', ...msg);
    }

    error(...msg: [unknown, ...unknown[]]): void {
        this.write('ERROR', ...msg);
    }

    write(label: string, ...messageParts: unknown[]): void {
        const message = messageParts.map(this.stringify).join(' ');
        const dateTime = new Date().toISOString();
        this._outputChannel.appendLine(`[${dateTime}] ${label}: ${message}`);
    }
    

    private stringify(val: unknown): string {
        if (typeof val === 'string') { return val; }
        return inspect(val, {
            colors: false,
            depth: 6, // heuristic
        });
    }
}

const logger = new Log();
export default logger;