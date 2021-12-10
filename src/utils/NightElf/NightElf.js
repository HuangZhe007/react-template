import NightElfCheckTemp from './NightElfCheck';
import AelfBridgeCheck from './NightElfCheck';
import { isMobile } from 'react-device-detect';

const isPhone = isMobile;
export const NightElfCheck = isPhone ? AelfBridgeCheck : NightElfCheckTemp;
export const getViewResult = (key, result) => {
  if (!result) {
    return undefined;
  }
  return result[key] || (result.result && result.result[key]);
};
