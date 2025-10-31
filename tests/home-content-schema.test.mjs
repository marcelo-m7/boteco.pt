import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localesRoot = join(__dirname, '..', 'src', 'content');
const locales = readdirSync(localesRoot);

const requiredSections = ['features', 'howItWorks', 'testimonials', 'faq'];

for (const locale of locales) {
  const homePath = join(localesRoot, locale, 'home.json');
  const homeContent = JSON.parse(readFileSync(homePath, 'utf8'));

  test(`[${locale}] home content exposes Reactbits schema`, () => {
    assert.ok(homeContent.sections, 'sections key is required');
    for (const section of requiredSections) {
      assert.ok(homeContent.sections[section], `sections.${section} is required`);
      assert.ok(
        typeof homeContent.sections[section].subtitle === 'string' && homeContent.sections[section].subtitle.length > 0,
        `sections.${section}.subtitle must be a non-empty string`,
      );
    }

    assert.ok(homeContent.sections.howItWorks.step, 'sections.howItWorks.step must be defined');
    assert.match(
      homeContent.sections.howItWorks.step,
      /{{\s*step\s*}}/,
      'sections.howItWorks.step must include the {{step}} placeholder',
    );

    assert.ok(homeContent.plans?.cta, 'plans.cta must be present');
    assert.ok(homeContent.finalCta?.subtitle, 'finalCta.subtitle must be present');
    assert.ok(homeContent.hero?.badge, 'hero.badge must be present');
  });
}
