import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import HeroSection from '../HeroSection';
import FeaturesSection from '../FeaturesSection';
import HowItWorksSection from '../HowItWorksSection';
import PlansSection from '../PlansSection';
import TestimonialsSection from '../TestimonialsSection';
import FaqSection from '../FaqSection';
import { renderWithProvidersToString } from '@/test-utils';

describe('Home sections', () => {
  it('renders hero content in Portuguese by default', () => {
    const { markup } = renderWithProvidersToString(<HeroSection />, { path: '/:locale', route: '/pt', locale: 'pt' });
    assert.ok(markup.includes('Boteco Pro: A Solução Completa para Bares e Restaurantes'));
    assert.ok(markup.includes('href="/pt/contato"'));
  });

  it('renders hero content in English when locale is set', () => {
    const { markup } = renderWithProvidersToString(<HeroSection />, { path: '/:locale', route: '/en', locale: 'en' });
    assert.ok(markup.includes('Boteco Pro: The Complete Solution for Bars and Restaurants'));
    assert.ok(markup.includes('href="/en/contato"'));
  });

  it('displays features grid with translated items', () => {
    const { markup } = renderWithProvidersToString(<FeaturesSection />);
    assert.equal((markup.match(/<h3/g) ?? []).length, 3);
    assert.ok(markup.includes('Gestão de Mesas'));
  });

  it('shows steps with correct depth variant', () => {
    const { markup } = renderWithProvidersToString(<HowItWorksSection />);
    assert.equal((markup.match(/<li>/g) ?? []).length, 3);
    assert.ok(markup.includes('bg-depth-surface'));
  });

  it('renders pricing table for English locale', () => {
    const { markup } = renderWithProvidersToString(<PlansSection />, { path: '/:locale', route: '/en', locale: 'en' });
    assert.ok(markup.includes('Our Plans'));
    assert.equal((markup.match(/<article/g) ?? []).length, 2);
  });

  it('renders testimonials carousel heading and items', () => {
    const { markup } = renderWithProvidersToString(<TestimonialsSection />);
    assert.ok(markup.includes('O que nossos clientes dizem'));
    assert.ok(markup.includes('Boteco Pro revolucionou'));
  });

  it('renders FAQ items with accordion buttons', () => {
    const { markup } = renderWithProvidersToString(<FaqSection />);
    assert.ok(markup.includes('Perguntas Frequentes'));
    assert.ok(markup.includes('Como faço para começar?'));
  });
});
