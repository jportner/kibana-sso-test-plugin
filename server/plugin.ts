/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
  SavedObjectsServiceStart,
} from '../../../src/core/server';

import { BarneyPluginSetup, BarneyPluginStart } from './types';
import { defineRoutes } from './routes';
import { toySavedObjectType } from '../common/saved_objects/toy';
import { ToyClient } from './lib/toy_client';

export class BarneyPlugin implements Plugin<BarneyPluginSetup, BarneyPluginStart> {
  private readonly logger: Logger;
  private getScopedClient?: SavedObjectsServiceStart['getScopedClient'];

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('barney: Setup');

    core.savedObjects.registerType(toySavedObjectType);
    const toyClient = new ToyClient(this.logger, () => this.getScopedClient);
    const router = core.http.createRouter();
    defineRoutes(router, toyClient);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('barney: Started');
    this.getScopedClient = core.savedObjects.getScopedClient;
    return {};
  }

  public stop() {}
}
