import { useToCreateSharedProps, useToConsumeSharedProps } from './hooks';
import sharedStateLogger from './logger';

const disableLogger = () => sharedStateLogger.showLogs = false
const enableLogger = () => sharedStateLogger.showLogs = true

export { useToCreateSharedProps, useToConsumeSharedProps, disableLogger, enableLogger };
