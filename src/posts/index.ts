import fm from 'front-matter';

const postModules = import.meta.glob('./*.md', { as: 'raw', eager: true });

export function loadPosts() {
  return Object.entries(postModules).map(([path, content]) => {
    const { attributes, body } = fm(content as string) as { attributes: { title: string; date: string }, body: string };
    const slug = path.split('/').pop()!.replace('.md', '');
    return {
      meta: {
        title: attributes.title,
        date: attributes.date,
        slug,
      },
      content: body,
    };
  });
}