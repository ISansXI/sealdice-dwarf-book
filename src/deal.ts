import { Article } from "./pojo/article";
import * as utils from "./utils";
import * as misc from "./misc";


export function run(ctx: seal.MsgContext, msg: seal.Message, cmdArgs: seal.CmdArgs, ext: seal.ExtInfo) {
    let cmds = cmdArgs.getRestArgsFrom(1).split(" ");
    let rawContent = msg.message;
    const userId = ctx.player.userId;
    const userName = ctx.player.name;
    const pLevel = ctx.privilegeLevel; // int 权限等级：40 邀请者、50 管理、60 群主、70 信任、100 master
    switch (cmds[0]) {
        case 'add': {
            if (cmds[1] == "help") {
                seal.replyToSender(ctx, msg, utils.formatString(misc.DB_HELP_DOCUMENT.add));
                break;
            } else {
                const getData = utils.getData(ext);
                let content = rawContent.indexOf("add") === -1 ? "" : rawContent.slice(rawContent.indexOf("add") + 3);
                content = content.replace(/^\s+/, '');
                if (content == "") {
                    seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.add.null));
                } else {
                    const id = getData.nextId;
                    getData.nextId = id + 1;
                    const a = new Article(content, userId, userName, id);
                    getData.data.unshift(a);
                    utils.saveData(ext, getData);
                    seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.add.success, id, getData.data.length));
                }
                break;
            }
        }
        case 'del': {
            if (cmds[1] == "help") {
                seal.replyToSender(ctx, msg, utils.formatString(misc.DB_HELP_DOCUMENT.del));
                break;
            } else {
                const getData = utils.getData(ext);
                const articles = getData.data;
                const index = cmds[1];
                const articleIndex = findArticleIndexById(articles, index);
                if (articleIndex == -1) {
                    seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.del.noFound));
                } else {
                    const articleAuthorId = articles[articleIndex].authorId;
                    if (articleAuthorId == userId || utils.checkPLevel(pLevel) >= 4) {
                        utils.removeElementByIndex(getData.data, articleIndex);
                        utils.saveData(ext, getData);
                        seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.del.success));
                    }
                    else {
                        seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.del.fail));
                    }
                }
                break;
            }
        }
        case 'edit': {
            if (cmds[1] == "help") {
                seal.replyToSender(ctx, msg, utils.formatString(misc.DB_HELP_DOCUMENT.edit));
                break;
            } else {
                const getData = utils.getData(ext);
                const articles = getData.data;
                const index = cmds[1];
                const articleIndex = findArticleIndexById(articles, index);
                if (articleIndex == -1) {
                    seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.edit.noFound));
                } else {
                    const articleAuthorId = articles[articleIndex].authorId;
                    if (articleAuthorId == userId || utils.checkPLevel(pLevel) >= 4) {
                        let content = utils.extractContentAfterEditFunctionPrefix(rawContent);
                        console.log("当前的rawContent: " + rawContent + "\n" + "当前edit的content: " + content) //debug
                        if (content == null) {
                            seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.edit.error));
                        } else {
                            content = content.replace(/^\s+/, '');
                            if (content == "") {
                                seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.edit.null));
                            } else {
                                const id = articles[articleIndex].id;
                                const createTimeOld = articles[articleIndex].createTime;
                                const editCountsOld = articles[articleIndex].editCounts;
                                const a = new Article(content, userId, userName, id);
                                a.createTime = createTimeOld;
                                a.editCounts = editCountsOld + 1;
                                getData.data[articleIndex] = a;
                                utils.saveData(ext, getData);
                                seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.edit.success));
                            }
                        }
                    }
                    else {
                        seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.edit.fail));
                    }
                }
                break;
            }
        }
        case 'list':
        case 'page': {
            if (cmds[1] == "help") {
                seal.replyToSender(ctx, msg, utils.formatString(misc.DB_HELP_DOCUMENT.list));
                break;
            } else {
                const countsPerPage = 10;
                const previewCount = 12;

                const getData = utils.getData(ext);
                let articles = getData.data;
                articles = filtArticles(articles, rawContent, userId);
                const pageSum = Math.floor(articles.length / countsPerPage) + 1;
                let page = parseInt(cmds[1]) || 1;
                if (page > pageSum) page = pageSum;
                if (page < 1) page = 1;
                let resB = "";
                for (let i = (page - 1) * countsPerPage; i < ((page * countsPerPage) > articles.length ? articles.length : page * countsPerPage); i++) {
                    let temp = articles[i].content.slice(0, previewCount);
                    temp = utils.replaceNewlinesWithSpaces(temp);
                    if (articles[i].content.length > previewCount) temp += '...';
                    resB += utils.formatString(misc.DB_RUN_INFO.list.resultOne, articles[i].id, temp);
                }
                resB += utils.formatString(misc.DB_RUN_INFO.list.footer, page, pageSum, articles.length);
                seal.replyToSender(ctx, msg, resB);
                break;
            }
        }
        case 'me': {
            seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.me, userId));
            break;
        }
        case 'tags': {
            seal.replyToSender(ctx, msg, utils.formatString(misc.DB_HELP_DOCUMENT.tags));
            break;
        }
        // 抽取或查看指定条目
        default: {
            if (utils.isPureNumber(cmds[0])) {
                const getData = utils.getData(ext);
                const articles = getData.data;
                const filteredList = filtArticles(articles, `--id=${cmds[0]}`, userId);
                if (filteredList.length == 0) {
                    seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.default.empty));
                } else {
                    const a = filteredList[0];
                    let res = utils.formatString(misc.DB_RUN_INFO.default.resultOne, a.id, a.content);
                    res = applyExtraParams(res, [a], rawContent);
                    seal.replyToSender(ctx, msg, res);
                }
            }
            else if (cmds[0] == "") {
                const getData = utils.getData(ext);
                let articles = getData.data;
                articles = filtArticles(articles, rawContent, userId);
                if (articles.length == 0) {
                    seal.replyToSender(ctx, msg, utils.formatString(misc.DB_RUN_INFO.default.empty));
                } else {
                    const len = articles.length;
                    const indexR = utils.getRandomInteger(0, len - 1);
                    let res = utils.formatString(misc.DB_RUN_INFO.default.resultOne, articles[indexR].id, articles[indexR].content);
                    res = applyExtraParams(res, [articles[indexR]], rawContent);
                    seal.replyToSender(ctx, msg, res);
                }
            }
            else {
                seal.replyToSender(ctx, msg, misc.DB_RUN_INFO.default.fail)
            }
        }
    }
}

// 应用Tags
/**
 * 应用Tags的额外结果
 * @param resBefore 仅包含基础结果的字符串
 * @param articles 预处理（或没有处理过）的条目串的数据
 * @param options 传入RawContent，即原消息内容
 * @returns 
 */
function applyExtraParams(resBefore: string, articles: Article[], options: string): string {
    let complexArgs = utils.extractDoubleDashItems(options);
    for (let c of complexArgs) {
        c = c.slice("--".length);
        if (c.startsWith("meta")) {
            if (articles.length == 1) {
                const article = articles[0];
                c = c.slice("meta".length);
                resBefore += utils.formatString(
                    misc.DB_TAGS_ADDON.meta,
                    article.authorId,
                    article.authorName,
                    article.editCounts,
                    article.editTime,
                    article.createTime
                );
            }
        }
    }

    return resBefore;
}

function findArticleIndexById(articles: Array<Article>, id: string) {
    for (let i = 0; i < articles.length; i++) {
        if (articles[i].id === parseInt(id)) {
            return i;
        }
    }
    return -1;
}

function filtArticles(articlesP: Array<Article>, options: string, userId: string): Array<Article> {
    let complexArgs = utils.extractDoubleDashItems(options);
    let articles = articlesP;
    for (let c of complexArgs) {
        c = c.slice("--".length);
        // console.log("正在执行判断" + c); //debug
        if (c.startsWith("id=")) {
            c = c.slice("id=".length);
            const res = [];
            for (let i = 0; i < articles.length; i++) {
                if (articles[i].id === parseInt(c)) {
                    res.push(articles[i]);
                }
            }
            articles = res;
        }
        else if (c.startsWith("authorId=")) {
            c = c.slice("authorId=".length);
            const res = [];
            for (let i = 0; i < articles.length; i++) {
                if (articles[i].authorId === c) {
                    res.push(articles[i]);
                }
            }
            articles = res;
        }
        else if (c.startsWith("content=")) {
            c = c.slice("content=".length);
            c = utils.extractQuotedStrings(c)[0];
            const res = [];
            for (let i = 0; i < articles.length; i++) {
                if (articles[i].content.includes(c)) {
                    res.push(articles[i]);
                }
            }
            articles = res;
        }
        else if (c.startsWith("c=")) {
            c = c.slice("c=".length);
            c = utils.extractQuotedStrings(c)[0];
            const res = [];
            for (let i = 0; i < articles.length; i++) {
                if (articles[i].content.includes(c)) {
                    res.push(articles[i]);
                }
            }
            articles = res;
        }
        else if (c.startsWith("self")) {
            const res = [];
            for (let i = 0; i < articles.length; i++) {
                if (articles[i].authorId === userId) {
                    res.push(articles[i]);
                }
            }
            articles = res;
        }
    }
    return articles;
}