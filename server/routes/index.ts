/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { schema } from '@kbn/config-schema';
import moment from 'moment';
import { IRouter } from '../../../../src/core/server';
import { ToyClient } from '../lib/toy_client';
import { KibanaResponseFactory } from '../../../../src/core/server/http/router';
import { toySchema } from '../../common/toy_schema';

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
      const toys = toyNames.map((title) => ({ title, description }));
      return await wrap(response, () => toyClient.bulkCreate(request, toys));
    }
  );
}
