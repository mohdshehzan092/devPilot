import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentVariableService {
  replaceVariables(
    text: string,
    variables: Record<string, string>,
  ): string {
    if (!text) {
      return text;
    }

    return text.replace(
      /\{\{(.*?)\}\}/g,
      (_, key) => {
        const variable = key.trim();

        return variables[variable] ?? `{{${variable}}}`;
      },
    );
  }
}