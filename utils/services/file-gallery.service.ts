/* eslint-disable @typescript-eslint/no-floating-promises */
import axios from 'axios';
import 'dotenv/config';
import { Model } from 'models';
import { FileModel } from 'models/File.model';
import * as FormData from 'form-data';
const http = axios.create({
  baseURL: process.env.API_GALERRY,
});

interface IDeleteFile {
  url?: string;
  urls?: string[];
}

export async function uploadFile(file: Buffer, folder: string = 'general') {
  const formData = new FormData();

  formData.append('file', file, { filename: 'profile.png' });

  try {
    const { data } = await http.post(`/?folder=${folder}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  } catch (error) {
    console.error(error?.response?.data);

    return null;
  }
}

export async function setFileParent(url: string, model: Model) {
  const file = await FileModel.query().findOne('url', url);

  if (file) {
    await file.$query().update({
      parent_id: model.id,
      table: model.$modelClass.tableName,
    });
  }
}

export function destroyFile({ url, urls }: IDeleteFile) {
  if (url || urls) {
    http({
      url: '',
      method: 'DELETE',
      data: { url, urls },
    })
      .then(({ data }) => console.log(data))
      .catch((err) => err?.response?.data);
  }
}
