"use client";

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Logo: React.FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = locale || 'pt';
  const getLocalizedPath = (path: string) => `/${currentLocale}${path}`;

  return (
    <Link to={getLocalizedPath('/')} className="text-2xl font-bold text-boteco-wine-foreground hover:text-boteco-mustard transition-colors">
      Boteco Pro
    </Link>
  );
};

export default Logo;