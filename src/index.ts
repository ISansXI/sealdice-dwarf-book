import { run } from "./deal";
import * as misc from "./misc";

function main() {
  // 注册扩展
  let ext = seal.ext.find(misc.DB_EXT_INFO.ext_name);
  if (!ext) {
    ext = seal.ext.new(misc.DB_EXT_INFO.ext_name, misc.DB_EXT_INFO.author, misc.DB_EXT_INFO.version);
    seal.ext.register(ext);
  }

  // 编写指令
  const cmdDwarfBook = seal.ext.newCmdItemInfo();
  cmdDwarfBook.name = misc.DB_EXT_INFO.ext_name;
  cmdDwarfBook.help = misc.DB_HELP_DOCUMENT.base;

  cmdDwarfBook.solve = (ctx, msg, cmdArgs) => {
    let val = cmdArgs.getArgN(1);
    switch (val) {
      case 'help': {
        const ret = seal.ext.newCmdExecuteResult(true);
        ret.showHelp = true;
        return ret;
      }
      default: {
        // 命令为 .seal XXXX，取第一个参数为名字
        run(ctx, msg, cmdArgs, ext);
        return seal.ext.newCmdExecuteResult(true);
      }
    }
  }

  // 注册命令
  for(let word of misc.DB_EXT_INFO.awake_words) {
    ext.cmdMap[word] = cmdDwarfBook;
  }
}

main();
