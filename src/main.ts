import { execSync } from 'child_process';
import { loop } from '@vorprog/loop';

const scrub = (content: string, secrets?: string[]): string => {
  loop(secrets, secret => content = content.replace(secret, `****REDACTED****`));
  return content;
}

const parseJson = (content: string): string => {
  try {
    return JSON.parse(content);
  } catch (error) {
    return content;
  }
}

export type ExecOptions = {
  ignorableErrors?: string[],
  secrets?: string[],
  logFunction?: (...data: any) => void
}

let defaultOptions: ExecOptions = {
  logFunction: console.log,
}

export const setDefaultOptions = (options: ExecOptions) => defaultOptions = Object.assign(defaultOptions, options);
export const exec = (command: string, options?: ExecOptions) => {
  const stackTrace = new Error().stack.split(`at `)[2].replace(`Object.<anonymous>`, ``).trim();
  const currentOptions = Object.assign(defaultOptions, options);

  try {
    command = command.replace(/\n/g, ` `); // replace new lines with spaces to keep the command on a single line
    if (currentOptions.logFunction) currentOptions.logFunction(`\nTRACE: ${stackTrace}`, scrub(command, currentOptions.secrets));
    const result = execSync(command, { stdio: 'pipe' }).toString();
    return parseJson(result);
  } catch (error) {
    if (error instanceof Error) {
      const scrubbedErrorMessage = scrub(error.message, currentOptions.secrets);
      let throwError = true;
      loop(currentOptions.ignorableErrors, ignorableError => scrubbedErrorMessage.includes(ignorableError) ? throwError = false : null);
      if (throwError) throw new Error(scrubbedErrorMessage);
    }
  }
}
