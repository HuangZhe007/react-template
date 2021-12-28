import NightElfCheck from './NightElfCheck';
import AelfBridgeCheck from '../AelfBridge/AelfBridgeCheck';
import { isMobile } from 'react-device-detect';
import VConsole from 'vconsole';
process.env.NODE_ENV === 'development' && isMobile && new VConsole();
export const NightElf = isMobile ? AelfBridgeCheck : NightElfCheck;
