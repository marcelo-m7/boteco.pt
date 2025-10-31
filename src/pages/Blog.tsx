import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import Seo from '@/components/Seo'; // Importar o componente Seo
import { Link, useParams } from 'react-router-dom'; // Importar Link e useParams
import { ScrollStack } from '@reactbits/navigation';

const Blog: React.FC = () => {
  const { t, i18n } = useTranslation('blog');
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || 'pt';

  const posts = t('posts', { returnObjects: true }) as { id: string; title: string; excerpt: string; date: string }[];

  const pageTitle = t('title');
  const pageDescription = t('description');

  // Função para gerar o slug a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-'); // Remove hífens duplicados
  };

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        ogTitle={pageTitle}
        ogDescription={pageDescription}
        locale={i18n.language}
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-6 text-boteco-wine">
          {t('title')}
        </h1>
        <p className="text-xl text-center mb-12 text-boteco-brown/90">
          {t('description')}
        </p>

        <ScrollStack
          items={posts.map((post, index) => ({
            id: post.id || `blog-post-${index}`,
            label: post.title,
            description: post.excerpt,
            meta: post.date,
          }))}
          ariaLabel={t('title')}
          listClassName="gap-10"
          itemClassName="bg-surface-gradient"
          itemActiveClassName="shadow-surface-strong ring-2 ring-boteco-mustard/40"
          renderItem={({ item }) => (
            <article className="flex flex-col gap-4">
              <header className="space-y-3">
                <h3 className="text-2xl font-semibold text-boteco-brown">
                  {item.label}
                </h3>
                <p className="flex items-center text-sm font-medium uppercase tracking-wide text-boteco-brown/70">
                  <CalendarDays className="mr-2 h-4 w-4" aria-hidden />
                  {item.meta}
                </p>
              </header>
              <p className="text-boteco-brown/90">
                {item.description}
              </p>
              <Link
                to={`/${currentLocale}/blog/${generateSlug(item.label)}`}
                className="text-boteco-mustard transition-colors hover:text-boteco-mustard/80 hover:underline"
              >
                {t('readMore', { defaultValue: 'Leia Mais' })}
              </Link>
            </article>
          )}
        />
      </div>
    </>
  );
};

export default Blog;