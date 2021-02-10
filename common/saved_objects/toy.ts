/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { SavedObjectsType } from '../../../../src/core/server';

export const toySavedObjectType: SavedObjectsType = {
  name: 'toy',
  hidden: false,
  namespaceType: 'multiple',
  management: {
    icon: 'beaker',
    defaultSearchField: 'title',
    importableAndExportable: true,
    getTitle(obj) {
      return obj.attributes.title;
    },
    // getEditUrl(obj) {
    //   return `/management/kibana/objects/savedVisualizations/${encodeURIComponent(obj.id)}`;
    // },
    // getInAppUrl(obj) {
    //   return {
    //     path: `/app/barney/toy/${encodeURIComponent(obj.id)}`,
    //     uiCapabilitiesPath: 'barney.show',
    //   };
    // },
  },
  mappings: {
    properties: {
      description: { type: 'text' },
      title: { type: 'text' },
    },
  },
};
