import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import helmetAsync from 'react-helmet-async';
import { createRequire } from 'node:module';
const { HelmetProvider } = helmetAsync;
const require = createRequire(import.meta.url);

import { loadTsModule, projectRoot } from './utils/ts-loader.mjs';

const loadMenuContent = (locale) => {
  const filePath = path.join(projectRoot, 'src', 'content', locale, 'menu.json');
  return JSON.parse(readFileSync(filePath, 'utf8'));
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

if (typeof globalThis.window === 'undefined') {
  globalThis.window = { location: { href: 'http://localhost/' } };
}

const translationCache = new Map();
const getMenuContentCached = (locale) => {
  if (!translationCache.has(locale)) {
    translationCache.set(locale, loadMenuContent(locale));
  }
  return translationCache.get(locale);
};

const getNestedValue = (source, pathSegments) => {
  return pathSegments.reduce((accumulator, segment) => {
    if (accumulator && typeof accumulator === 'object' && segment in accumulator) {
      return accumulator[segment];
    }
    return undefined;
  }, source);
};

let currentLocale = 'pt';

const useTranslationStub = () => {
  const translate = (key, options = {}) => {
    const content = getMenuContentCached(currentLocale);
    if (!key) {
      return options.defaultValue ?? '';
    }
    const segments = key.split('.');
    const value = getNestedValue(content, segments);

    if (options.returnObjects) {
      if (value !== undefined) {
        return value;
      }
      return options.defaultValue ?? {};
    }

    if (typeof value === 'string') {
      return value;
    }

    return options.defaultValue ?? key;
  };

  return {
    t: translate,
    i18n: {
      language: currentLocale,
      changeLanguage: async (lng) => {
        currentLocale = lng;
        return lng;
      },
    },
    ready: true,
  };
};

const reactI18nextPath = require.resolve('react-i18next');
require.cache[reactI18nextPath] = {
  id: reactI18nextPath,
  filename: reactI18nextPath,
  loaded: true,
  exports: { useTranslation: useTranslationStub },
};

const Menu = loadTsModule('src/pages/Menu.tsx').default;

const renderMenu = async (locale) => {
  currentLocale = locale;
  const helmetContext = {};

  return renderToStaticMarkup(
    React.createElement(
      HelmetProvider,
      { context: helmetContext },
      React.createElement(
        StaticRouter,
        { location: `/${locale}/menu` },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: '/:locale/menu',
            element: React.createElement(Menu),
          }),
        ),
      ),
    ),
  );
};

describe('Menu page', () => {
  it('renders categories and items from localized JSON', async () => {
    for (const locale of ['pt', 'en']) {
      const markup = await renderMenu(locale);
      const content = loadMenuContent(locale);

      for (const category of content.categories) {
        assert.ok(
          markup.includes(escapeHtml(category.name)),
          `Expected markup for ${locale} to include category ${category.name}`,
        );

        for (const item of category.items) {
          assert.ok(
            markup.includes(escapeHtml(item.name)),
            `Expected markup for ${locale} to include item ${item.name}`,
          );
        }
      }
    }
  });

  it('switches locale specific copy between Portuguese and English', async () => {
    const ptMarkup = await renderMenu('pt');
    const enMarkup = await renderMenu('en');

    assert.ok(ptMarkup.includes('Feijoada Completa Boteco Pro'));
    assert.ok(!ptMarkup.includes('Boteco Pro Feijoada'));
    assert.ok(enMarkup.includes('Boteco Pro Feijoada'));
    assert.ok(!enMarkup.includes('Feijoada Completa Boteco Pro'));
  });
});
