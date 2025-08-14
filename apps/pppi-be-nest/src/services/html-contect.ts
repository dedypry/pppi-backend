import { join } from 'path';
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';

Handlebars.registerHelper('upper', (val: string) => val.toUpperCase());

export async function getHtmlContent(
  templateName: string,
  data: Record<string, any>,
) {
  const filePath = join(
    process.cwd(),
    'dist/apps/pppi-be-nest',
    'views',
    `${templateName}.hbs`,
  );
  const fileContent = await readFile(filePath, 'utf-8');
  const compiledTemplate = Handlebars.compile(fileContent);
  return compiledTemplate(data);
}
