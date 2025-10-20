import {Drm, ReactVideoSource, TextTracks} from '@datazoom/dz_react_native_video';

export type AdditionalSourceInfo = {
  textTracks?: TextTracks;
  adTagUrl?: string;
  description?: string;
  drm?: Drm;
  noView?: boolean;
};

export type SampleVideoSource = ReactVideoSource | AdditionalSourceInfo;
