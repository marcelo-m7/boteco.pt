import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@clerk/clerk-react';
import { Package, Utensils, DollarSign, AlertTriangle } from 'lucide-react';
import Seo from '@/components/Seo'; // Importar o componente Seo
import { ScrollStack } from '@reactbits/navigation';

const Painel: React.FC = () => {
  const { t, i18n } = useTranslation('painel');
  const { user } = useUser();

  const userName = user?.firstName || t('guest', { defaultValue: 'Usuário' });
  const cards = t('cards', { returnObjects: true }) as {
    title: string;
    value: string;
    description: string;
  }[];

  const getIcon = (title: string) => {
    switch (title) {
      case t('cards.0.title'): // Pedidos Recentes
        return <Package className="h-8 w-8 text-boteco-mustard" />;
      case t('cards.1.title'): // Mesas Abertas
        return <Utensils className="h-8 w-8 text-boteco-mustard" />;
      case t('cards.2.title'): // Estoque Baixo
        return <AlertTriangle className="h-8 w-8 text-boteco-mustard" />;
      case t('cards.3.title'): // Vendas Hoje
        return <DollarSign className="h-8 w-8 text-boteco-mustard" />;
      default:
        return null;
    }
  };

  const cardItems = cards.map((card, index) => ({
    id: `painel-card-${index}`,
    label: card.title,
    value: card.value,
    description: card.description,
    icon: getIcon(card.title),
  }));

  const pageTitle = t('title');
  const pageDescription = t('demoNotice');

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
        <h1 className="text-4xl font-bold mb-4 text-boteco-wine">
          {t('greeting', { userName })}
        </h1>
        <p className="text-xl text-boteco-brown/90 mb-8">
          {t('title')}
        </p>
        <p className="text-sm text-boteco-brown/80 mb-12 italic">
          {t('demoNotice')}
        </p>

        <ScrollStack
          items={cardItems}
          ariaLabel={t('title')}
          listClassName="gap-8"
          itemClassName="bg-surface-gradient"
          itemActiveClassName="shadow-surface-strong ring-2 ring-boteco-mustard/40"
          renderItem={({ item }) => (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold uppercase tracking-wide text-boteco-brown/70">
                    {item.label}
                  </span>
                  <span className="text-3xl font-bold text-boteco-wine">
                    {item.value}
                  </span>
                </div>
                {React.isValidElement(item.icon) ? (
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-boteco-wine/10 text-boteco-mustard">
                    {React.cloneElement(item.icon, {
                      className: 'h-7 w-7',
                      'aria-hidden': true,
                    })}
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-boteco-brown/80">{item.description}</p>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default Painel;