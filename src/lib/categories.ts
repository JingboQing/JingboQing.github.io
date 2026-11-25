// 帖子分类：增加、改名、删除分类只改这里。
// - id：写在帖子开头的 `type:` 里，只用英文小写和短横线，发布后尽量不改。
// - zh / en：筛选栏和帖子上显示的名称，可以随时改。
// - 顺序就是筛选栏的顺序；没有帖子的分类不显示。
// 删除一个分类前，先把用到它的帖子改成别的分类，否则构建会报错。
export const categories = [
  { id: 'research', zh: '研究工作', en: 'Research' },
  { id: 'news', zh: '学术动态', en: 'News' },
  { id: 'resource', zh: '分享', en: 'Resources' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];
export const categoryIds = categories.map((category) => category.id) as [CategoryId, ...CategoryId[]];
