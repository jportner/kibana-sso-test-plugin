/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';
import type { SpacesOssPluginStart } from '../../../src/plugins/spaces_oss/public';

export interface BarneyPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BarneyPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
  spacesOss: SpacesOssPluginStart;
}
