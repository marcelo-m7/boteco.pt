import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next, { type i18n } from 'i18next';
import type { ReactElement, ReactNode } from 'react';
import ptHome from '@/content/pt/home.json';
import enHome from '@/content/en/home.json';

const resources = {
  pt: { home: ptHome },
  en: { home: enHome },
};

interface ProvidersOptions {
  route?: string;
  path?: string;
  locale?: 'pt' | 'en';
}

export const createTestI18n = (locale: 'pt' | 'en' = 'pt'): i18n => {
  const instance = i18next.createInstance();
  instance.init({
    lng: locale,
    fallbackLng: 'pt',
    resources,
    ns: ['home'],
    defaultNS: 'home',
    interpolation: { escapeValue: false },
  });
  return instance;
};

export const renderWithProvidersToString = (
  ui: ReactElement,
  { route = '/', path = '/', locale = 'pt' }: ProvidersOptions = {},
) => {
  const i18n = createTestI18n(locale);

  const Wrapper = ({ children }: { children?: ReactNode }) => (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={children} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>
  );

  const markup = renderToString(<Wrapper>{ui}</Wrapper>);
  return { markup, i18n };
};
