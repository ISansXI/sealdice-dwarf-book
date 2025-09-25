export const DB_HELP_DOCUMENT = {
    "base": `\
这本矮人的书连接了所有维度...
一些篇目从各位纂写者那里记录下来。
- 无参数 : 随机抽取书的一条
- <编号> : 获取指定的条目信息
- list/page <页码> : 查看指定页的条目，也可以查找符合条件的条目，条件Tag请输入'.dwarf tags'查看
- add <条目内容> : 添加新的条目
- del <条目编号> : 删除指定条目
- edit <条目编号> <条目内容> : 修改指定条目
- tags : 列出可用的指令额外参数
- me : 查看自己的userId\
`,
    "add": `\
这个指令用于添加条目
使用方法如: '.dwarf add 条目信息balabala'\
`,
    "list": `\
这个指令可以浏览这本书
使用方法如: '.dwarf list <页码>'
可以搭配不同的条件，如: '.dwarf list 3 --content="内容 balabala"'\
`,
    "edit": `\
这个指令可以修改指定的条目内容
使用方法如: '.dwarf edit 123 <修改之后的内容>'\
`,
    "del": `\
这个指令可以用来删除指定的条目内容
使用方法如: '.dwarf del 123'
`,
    "tags": `\
这里展示了目前可用的额外参数和对应可用的指令，多个参数可以搭配使用
--id=<条目ID> : 查询指定条目ID的条目内容，适用指令'直接查看'
--content="<内容>" : 查询包含指定内容的条目列表，适用指令'list'、'直接查看无参数'
--authorId=<用户ID> : 查询指定用户创建的条目列表，适用指令'list'、'直接查看无参数'
--self : 查询自己发布的指定内容的条目列表，适用指令'list'、'直接查看无参数'
-- meta : 查看一个条目的详细内容，适用指令'直接查看'、'直接查看无参数'\
`
}

export const DB_EXT_INFO = {
    "ext_name": "sans-dwarf-book",
    "author": "地星 AKA Sans",
    "version": "1.0.0",
    "awake_words": [
        "dwarf",
        "db"
    ]
}

export const DB_RUN_INFO = {
    "add": {
        "success": "已成功添加条目，条目ID为%s，当前一共%s条条目",
        "null": "添加的条目信息不可为空"
    },
    "default": {
        "fail": "指令格式不正确，输入'.dwarf help'来查看指令详细使用方式",
        "resultOne": "[%s] %s",
        "empty": "当前检索内并没有内容"
    },
    "list": {
        "resultOne": "[%s] %s\n",
        "footer": "当前第%s页，共%s页\n当前检索到%s条条目"
    },
    "del": {
        "success": "已经成功删除该条目",
        "fail": "你没有这个条目的权限",
        "noFound": "不存在指定序号的条目"
    },
    "edit": {
        "success": "已经成功编辑该条目",
        "fail": "你没有这个条目的权限",
        "null": "更改的条目信息不可为空",
        "noFound": "不存在指定序号的条目"
    },
    "me": "你的userId为：'%s'"
}

export const DB_TAGS_ADDON = {
    "meta": "\n-\n条目创建者ID: %s\n最后编辑者名: %s\n总计编辑次数: %s\n最后编辑时间: %s\n条目创建时间: %s"

}