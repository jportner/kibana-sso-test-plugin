/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';

import { ToySchemaType } from '../../common/toy_schema';
import { CoreStart, SavedObject } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';
import type { SpacesOssPluginStart } from '../../../../src/plugins/spaces_oss/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

interface Props {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  spacesOss: SpacesOssPluginStart;
}

interface State {
  toys: Array<SavedObject<ToySchemaType>>;
}

export class BarneyApp extends Component<Props, State> {
  state = { toys: [] } as State;

  public async componentDidMount() {
    this.refreshData();
  }
  refreshData = async () => {
    const toys = await this.props.http.get('/api/barney/toy');
    this.setState({ toys });
  };
  clickGetNewToys = async () => {
    // Use the core http service to make a response to the server API.
    await this.props.http.post('/api/barney/toy/sample-data');
    this.refreshData();
  };
  clickShowToast = async () => {
    const { spacesOss } = this.props;
    if (spacesOss.isSpacesAvailable) {
      await spacesOss.ui.redirectLegacyUrl('#foo');
    }
  };

  public render() {
    const { basename, navigation, spacesOss } = this.props;
    const LegacyUrlConflict = spacesOss.isSpacesAvailable
      ? spacesOss.ui.components.LegacyUrlConflict
      : () => <></>;
    // Render the application DOM.
    // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
    return (
      <Router basename={basename}>
        <navigation.ui.TopNavMenu appName={PLUGIN_ID} showSearchBar={true} />
        <EuiPage restrictWidth="1000px">
          <EuiPageBody>
            <EuiPageHeader>
              <EuiTitle size="l">
                <h1>{PLUGIN_NAME}</h1>
              </EuiTitle>
            </EuiPageHeader>
            <EuiPageContent>
              <EuiPageContentHeader>
                <EuiTitle>
                  <h2>Sharing is caring!</h2>
                </EuiTitle>
              </EuiPageContentHeader>

              <LegacyUrlConflict
                currentObjectId={'123'}
                otherObjectId={'456'}
                otherObjectPath={'#otherobject'}
              />

              <EuiPageContentBody>
                <EuiText>
                  <ol>
                    {this.state.toys.map((toy, index) => (
                      <li key={index}>
                        {toy.attributes.title} / {toy.attributes.description} ({toy.id})
                      </li>
                    ))}
                  </ol>
                  <EuiHorizontalRule />

                  <EuiFlexGroup gutterSize="s" alignItems="center">
                    <EuiFlexItem grow={false}>
                      <EuiButton color="primary" size="s" onClick={this.clickGetNewToys}>
                        Get new toys
                      </EuiButton>
                    </EuiFlexItem>

                    <EuiFlexItem grow={false}>
                      <EuiButtonEmpty color="primary" size="s" onClick={this.clickShowToast}>
                        Show redirectLegacyUrl toast
                      </EuiButtonEmpty>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiText>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      </Router>
    );
  }
}
