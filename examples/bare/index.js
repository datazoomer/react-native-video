/**
 * @format
 */

import {AppRegistry} from 'react-native';
import InitialScreen from 'common/InitialScreen';
import BasicExample from 'common/BasicExample';
import {name as appName} from './app.json';
import DRMExample from 'common/DRMExample';

AppRegistry.registerComponent(appName, () => InitialScreen);
AppRegistry.registerComponent('BasicExample', () => BasicExample);
AppRegistry.registerComponent('DRMExample', () => DRMExample);
