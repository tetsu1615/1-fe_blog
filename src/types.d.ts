export interface PostMeta {
  title: string;
  date: string;
  slug: string;
}

export type Post = {
  meta: {
    title: string;
    date: string;
    slug: string;
  };
  content: string;
};
