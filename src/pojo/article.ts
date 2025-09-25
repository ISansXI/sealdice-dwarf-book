export class Article {
    public content: string;
    public authorId: string;
    public authorName: string;
    public editCounts: number;
    public editTime: string;
    public createTime: string;
    public id: number;

    // 无参数构造方法
    constructor()
    // 全参数构造方法
    constructor(
        content: string,
        authorId: string,
        authorName: string,
        id: number
    )
    // 构造方法实现
    constructor(
        content?: string,
        authorId?: string,
        authorName?: string,
        id?: number,
        editCounts?: number
    ) {
        this.content = content || '';
        this.authorId = authorId || '';
        this.authorName = authorName || '';
        this.id = id;
        this.editCounts = editCounts || 1;
        this.updateEditTime();
        // 无论是否传入createTime，都设置为当前时间
        this.createTime = this.formatDate(new Date());
    }

    update(content: string) {
        this.content = content;
        this.editCounts++;
        this.updateEditTime();
    }

    // 更新编辑时间为当前时间
    private updateEditTime(): void {
        this.editTime = this.formatDate(new Date());
    }

    // 格式化日期为"yyyy-MM-dd hh:mm"格式
    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = this.padZero(date.getMonth() + 1);
        const day = this.padZero(date.getDate());
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // 补零函数，确保月份、日期等是两位数
    private padZero(num: number): string {
        return num < 10 ? `0${num}` : num.toString();
    }
}
