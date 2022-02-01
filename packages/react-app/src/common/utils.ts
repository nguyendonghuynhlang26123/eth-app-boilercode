import { ethers } from "ethers";
import moments from 'moment'

class Utils {

  static generateGUID(): string {
    function S4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return S4() + S4();
  }

  static sanitizeString(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/\W+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  static stringToSlug(t: string): string {
    return t
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  static getParameterByName(name: string, url: string) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // Check if list of arguments are all true
  static isLoading(...args: boolean[]): boolean {
    for (var i = 0; i < args.length; ++i) if (args[i]) return true;
    return false;
  }

  static displayDate(timestamp: number): string {
    let d = new Date(timestamp);
    return [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') + ' ' + [d.getHours(), d.getMinutes()].join(':');
  }

  static toCapitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static async nullIfError(fn: Promise<any>, msg?: string): Promise<any> {
    try {
      const result = await fn;
      return result;
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  static truncate(str: string, maxDecimalDigits: number) {
    if (str.includes('.')) {
      const parts = str.split('.');
      return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
    }
    return str;
  }
  static prettyNum = (b: ethers.BigNumberish) => Utils.truncate(ethers.utils.formatEther(b), 2);

  static trimHash = (hash: string) => hash.substring(0, 6) + '...' + hash.slice(-4);

  static timeAgo = (timeStamp: number) => moments(timeStamp).fromNow();
}

export default Utils;
