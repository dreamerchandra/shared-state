class LogManger {
  showLogs = true
  print (loggerType, ...args) {
    if (this.showLogs) {
      console[loggerType](...args)
    }
  }
  log = (...args) => this.print('log', ...args)
  warn = (...args) => this.print('warn', ...args)
  error = (...args) => this.print('error', ...args)
}

const console = new LogManger();

export default console;