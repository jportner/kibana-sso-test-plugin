/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { schema } from '@kbn/config-schema';
import moment from 'moment';
import { IRouter } from '../../../../src/core/server';
import { ToyClient } from '../lib/toy_client';
import { KibanaResponseFactory } from '../../../../src/core/server/http/router';
import { toySchema, ToySchemaType } from '../../common/toy_schema';

const TOY_PATH = '/api/barney/toy';

const wrap = async (response: KibanaResponseFactory, fn: () => Promise<any>) => {
  try {
    const result = await fn();
    return response.ok({ body: result });
  } catch (error) {
    const { message } = error;
    return response.internalError({ body: { message } });
  }
};

export function defineRoutes(router: IRouter, toyClient: ToyClient) {
  router.get(
    {
      path: `${TOY_PATH}/{id}`,
      validate: { params: schema.object({ id: schema.string() }) },
    },
    async (_context, request, response) => {
      const { id } = request.params;
      return await wrap(response, () => toyClient.get(request, id));
    }
  );
  router.get(
    {
      path: TOY_PATH,
      validate: false,
    },
    async (_context, request, response) => {
      return await wrap(response, () => toyClient.getAll(request));
    }
  );
  router.post(
    {
      path: TOY_PATH,
      validate: { body: schema.object({ toy: toySchema }) },
    },
    async (_context, request, response) => {
      const { toy } = request.body;
      return await wrap(response, () => toyClient.create(request, toy));
    }
  );
  router.post(
    {
      path: `${TOY_PATH}/sample-data`,
      validate: false,
    },
    async (_context, request, response) => {
      const toyNames = [
        'Sheriff Woody',
        'Buzz Lightyear',
        'Bo Peep',
        'Mr. Potato Head',
        'Slinky Dog',
        'Rex',
        'Hamm',
      ];
      const description = `Created on ${moment().format('lll')}`;
      const toys: ToySchemaType[] = toyNames.map((title) => ({
        title: `${title} #${Math.floor(Math.random() * 1000) + 1}`,
        description,
        ...(title === 'Slinky Dog' && { initialNamespaces: ['*'] }),
      }));
      for (let i = 0; i < 4; i++) {
        toys.push({
          title: `Army Man #${Math.floor(Math.random() * 1000) + 1}`,
          description: `Created on ${moment().format('lll')}`,
          originId: 'toyarmymanoriginid',
        });
      }
      return await wrap(response, () => toyClient.bulkCreate(request, toys));
    }
  );
}
