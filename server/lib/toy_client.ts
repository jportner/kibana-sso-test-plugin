/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
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
    const objects = toys.map(({ originId, initialNamespaces, ...attributes }) => ({
      type: this.TYPE,
      attributes,
      ...(originId && { originId }),
      ...(initialNamespaces && { initialNamespaces }),
    }));
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
