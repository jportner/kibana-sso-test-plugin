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

import { Logger, SavedObjectsServiceStart, KibanaRequest } from '../../../../src/core/server';
import { ToySchemaType } from '../../common/toy_schema';
import { toySavedObjectType } from '../../common/saved_objects/toy';

export class ToyClient {
  private TYPE = toySavedObjectType.name;
  private MAX_TOYS = 100;

  constructor(
    private logger: Logger,
    private savedObjects: () => SavedObjectsServiceStart['getScopedClient'] | undefined
  ) {}

  get = async (request: KibanaRequest, id: string) => {
    return this.getClient(request).get(this.TYPE, id);
  };

  getAll = async (request: KibanaRequest) => {
    const results = await this.getClient(request).find<ToySchemaType>({
      type: this.TYPE,
      page: 1,
      perPage: this.MAX_TOYS,
      // sortField: 'title.keyword',
    });
    return results.saved_objects;
  };

  create = async (request: KibanaRequest, toy: ToySchemaType) => {
    return this.getClient(request).create(this.TYPE, toy);
  };

  bulkCreate = async (request: KibanaRequest, toys: ToySchemaType[]) => {
    const objects = toys.map((attributes) => ({ type: this.TYPE, attributes }));
    return this.getClient(request).bulkCreate(objects);
  };

  private getClient = (request: KibanaRequest) => {
    const scopedClientFactory = this.savedObjects();
    if (!scopedClientFactory) {
      throw Error(`The saved objects client hasn't been initialised yet`);
    }
    return scopedClientFactory(request);
  };
}
