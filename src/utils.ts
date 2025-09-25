import { Article } from "./pojo/article";

const STORAGE_KEY = "sans-dwarf-book-storage";

interface dataStruct {
    data: Array<Article>,
    nextId: number
}

function initDataStruct() {
    const struct = '{"data":[], "nextId":1}';
    return struct;
}

function getData(ext: seal.ExtInfo): dataStruct {
    //读取数据
    const getData = JSON.parse(ext.storageGet(STORAGE_KEY) || initDataStruct());
    return getData;
}

function saveData(ext: seal.ExtInfo, data: any): number {
    //存储数据
    try {
        ext.storageSet(STORAGE_KEY, JSON.stringify(data));
    }
    catch (e) {
        console.error(e);
        return 1;
    }
    return 0;
}

function formatString(template: string, ...args: any[]): string {
    let result = template;
    for (const arg of args) {
        // 替换第一个出现的%s
        result = result.replace('%s', String(arg));
    }
    return result;
}

function extractDoubleDashItems(str: string): string[] {
    const regex = /--\S+/g;

    // 执行匹配并返回结果数组
    const matches = str.match(regex);

    // 如果没有匹配到任何项，返回空数组
    return matches ? matches : [];
}

function extractQuotedStrings(str: string): string[] {
    // 正则表达式解释：
    // (['"]) 匹配单引号或双引号，并捕获为分组
    // (.*?) 非贪婪匹配任意字符（除换行外），直到遇到对应的结束引号
    // \1 匹配与第一个分组相同的引号（保证前后引号一致）
    // g 全局匹配，i 忽略大小写（这里实际不影响引号匹配）
    const regex = /(["])(.*?)\1/g;

    const result: string[] = [];
    let match;

    // 循环查找所有匹配项
    while ((match = regex.exec(str)) !== null) {
        // match[2] 是引号内的内容
        result.push(match[2]);
    }

    return result;
}

function isPureNumber(str: string): boolean {
    // 匹配由0-9组成的非空字符串
    return /^\d+$/.test(str);
}

function getRandomInteger(a: number, b: number): number {
    // 确保a和b都是整数
    const min = Math.ceil(a);
    const max = Math.floor(b);

    // 处理a > b的情况，交换它们
    const actualMin = Math.min(min, max);
    const actualMax = Math.max(min, max);

    // 生成[actualMin, actualMax]之间的随机整数
    // 公式：Math.floor(Math.random() * (max - min + 1)) + min
    return Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin;
}

/**
 * 获取指定等级的用户组，0为普通，1为邀请者，2为管理，3为群主，4为信任，5为master
 * @param pLevel 
 * @returns 
 */
function checkPLevel(pLevel: number): number {
    switch (pLevel) {
        case 40:
            return 1;
        case 50:
            return 2;
        case 60:
            return 3;
        case 70:
            return 4;
        case 100:
            return 5;
        default:
            return 0;
    }
}

function removeElementByIndex<T>(arr: T[], index: number): T[] {
    // 检查索引是否有效
    if (index < 0 || index >= arr.length) {
        console.warn("无效的索引");
        return [...arr]; // 返回原数组的副本
    }

    arr.splice(index, 1);

    return arr;
}

function extractContentAfterEditFunctionPrefix(str: string): string | null {
    const regex = /^\.\w+\s+edit\s+\d+\s*(.*)$/;

    const match = str.match(regex);

    // 如果找到匹配，返回前缀后的内容，否则返回null
    return match ? match[1] : null;
}

function replaceNewlinesWithSpaces(str: string): string {
    // 正则表达式匹配所有换行符（包括 \n、\r\n 等）
    // /[\r\n]+/g 匹配一个或多个回车符或换行符，全局替换
    return str.replace(/[\r\n]+/g, ' ');
}

export {
    getData,
    saveData,
    formatString,
    extractDoubleDashItems,
    extractQuotedStrings,
    isPureNumber,
    getRandomInteger,
    checkPLevel,
    removeElementByIndex,
    extractContentAfterEditFunctionPrefix,
    replaceNewlinesWithSpaces
}

