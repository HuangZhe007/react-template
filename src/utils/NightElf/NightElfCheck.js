let nightElfInstance = null;
let aelfInstanceByExtension = null;
export default class NightElfCheck {
  constructor() {
    let resolveTemp = null;
    this.check = new Promise((resolve, reject) => {
      if (window.NightElf) {
        console.log('There is nightelf');
        resolve(true);
      }
      setTimeout(() => {
        reject({
          error: 200001,
          message: 'timeout, please download and install the NightELF explorer extension',
        });
      }, 5000);
      resolveTemp = resolve;
    });
    document.addEventListener('NightElf', () => {
      resolveTemp(true);
    });
  }
  static getInstance() {
    if (nightElfInstance) return nightElfInstance;
    nightElfInstance = new NightElfCheck();
    return nightElfInstance;
  }
  static initAelfInstanceByExtension(HTTP_PROVIDER, APP_NAME) {
    aelfInstanceByExtension = new window.NightElf.AElf({
      httpProvider: [HTTP_PROVIDER],
      appName: APP_NAME,
    });
    return aelfInstanceByExtension;
  }
}
