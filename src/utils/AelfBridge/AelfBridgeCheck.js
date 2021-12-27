import AElfBridge from 'aelf-bridge';
import { aelfConstants } from 'constants/aelfConstants';

let aelfBridgeInstance = null;
// let aelfInstanceByExtension = null;
let aelfInstanceByBridge = null;
let contractInstances = {};

let accountInfo = null;

export default class AelfBridgeCheck {
  constructor() {
    this.check = new Promise((resolve, reject) => {
      const bridgeInstance = new AElfBridge({
        timeout: 3000,
      });
      bridgeInstance.connect().then((isConnected) => {
        if (isConnected) {
          resolve(true);
        } else {
          reject({
            error: 200001,
            message: 'timeout, please use AELF Wallet APP or open the page in PC',
          });
        }
      });
      setTimeout(() => {
        reject({
          error: 200001,
          message: 'timeout, please use AELF Wallet APP or open the page in PC',
        });
      }, 3000);
    });
  }
  static getInstance() {
    if (!aelfBridgeInstance) {
      aelfBridgeInstance = new AelfBridgeCheck();
      return aelfBridgeInstance;
    }
    return aelfBridgeInstance;
  }

  // For extension users
  static getAelfInstanceByExtension() {
    if (!aelfInstanceByBridge) {
      AelfBridgeCheck.resetContractInstances();
      // AelfBridgeCheck.initAelfInstanceByExtension();
      AelfBridgeCheck.initAelfInstanceByExtension();
    }
    return aelfInstanceByBridge;
  }

  static initAelfInstanceByExtension() {
    // static initAelfInstanceByBridge() {
    aelfInstanceByBridge = new AElfBridge({
      endpoint: aelfConstants.HTTP_PROVIDER,
    });

    // TODO: get once, storage in local storage.
    aelfInstanceByBridge.login = async () => {
      if (accountInfo) {
        return accountInfo;
      }
      const account = await aelfInstanceByBridge.account();
      accountInfo = {
        detail: JSON.stringify(account.accounts[0]),
      };
      return accountInfo;
    };
    // aelfInstanceByBridge.logout = async () => {
    //   accountInfo = null;
    //   return true;
    // };
    aelfInstanceByBridge.logout = (param, callback) => {
      accountInfo = null;
      callback();
    };
    return aelfInstanceByBridge;
  }

  static resetContractInstances() {
    contractInstances = {};
  }

  static async getContractInstance(inputInitParams) {
    const { contractAddress } = inputInitParams;

    if (!accountInfo) {
      throw Error('Please login');
    }
    const address = JSON.parse(accountInfo.detail).address;

    if (contractInstances[contractAddress + address]) {
      return contractInstances[contractAddress + address];
    }
    return await AelfBridgeCheck.initContractInstance(inputInitParams);
  }

  // singleton to get, new to init
  static async initContractInstance(inputInitParams) {
    const { contractAddress } = inputInitParams;
    const aelf = AelfBridgeCheck.getAelfInstanceByExtension();
    if (!accountInfo) {
      throw Error('Please login');
    }
    const address = JSON.parse(accountInfo.detail).address;

    const contractInstance = await aelf.chain.contractAt(contractAddress);
    contractInstances[contractAddress + address] = contractInstance;
    return contractInstance;
  }
}
