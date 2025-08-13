import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {
  // menerima Buffer, mengembalikan array objek
  parseExcel(buffer: Buffer) {
    // baca workbook dari buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const sheets = workbook.SheetNames.map((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });
      const rows = data.map((item: any) => this.normalizeKeys(item));

      return {
        sheetName,
        rows,
      };
    });
    return sheets;
  }

  normalizeKeys(obj: Record<string, any>) {
    const newObj: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
      let newKey = slugify(key, {
        replacement: '_',
        remove: undefined,
        lower: true,
        strict: true,
        locale: 'vi',
        trim: true,
      });

      if (!newKey) {
        newKey = `field_${Object.keys(newObj).length + 1}`;
      }
      newObj[newKey] = value;
    });

    return newObj;
  }
}
