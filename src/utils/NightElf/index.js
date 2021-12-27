import NightElfCheck from './NightElfCheck';
import AelfBridgeCheck from '../AelfBridge/AelfBridgeCheck';
import { isMobile } from 'react-device-detect';
export const NightElf = isMobile ? AelfBridgeCheck : NightElfCheck;
