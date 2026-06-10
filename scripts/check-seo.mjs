import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const distDir = new URL('../dist/', import.meta.url)

const requiredFiles = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'index.html.md',
  'rules/index.html.md',
  'privacy/index.html.md',
]

const missingFiles = requiredFiles.filter((file) => !existsSync(join(distDir.pathname, file)))

if (missingFiles.length > 0) {
  throw new Error(`Missing SEO files in dist: ${missingFiles.join(', ')}`)
}

const indexHtml = readFileSync(join(distDir.pathname, 'index.html'), 'utf8')
const robots = readFileSync(join(distDir.pathname, 'robots.txt'), 'utf8')
const sitemap = readFileSync(join(distDir.pathname, 'sitemap.xml'), 'utf8')

const checks = [
  ['title', /<title>[^<]{10,70}<\/title>/i.test(indexHtml)],
  ['meta description', /<meta\s+name="description"[\s\S]*?content="[^"]{50,170}"/i.test(indexHtml)],
  ['canonical', /<link\s+rel="canonical"\s+href="https:\/\/www\.projektlyoon\.com\/"/i.test(indexHtml)],
  ['Open Graph image', /<meta\s+property="og:image"/i.test(indexHtml)],
  ['Twitter card', /<meta\s+name="twitter:card"/i.test(indexHtml)],
  ['JSON-LD', /<script\s+type="application\/ld\+json">/i.test(indexHtml)],
  ['noscript fallback', /<noscript>[\s\S]*<h1>Unkind<\/h1>/i.test(indexHtml)],
  ['robots sitemap', /Sitemap:\s*https:\/\/www\.projektlyoon\.com\/sitemap\.xml/i.test(robots)],
  ['sitemap XML', /^<\?xml[\s\S]*<urlset/i.test(sitemap.trim())],
  ['sitemap homepage', /<loc>https:\/\/www\.projektlyoon\.com\/<\/loc>/i.test(sitemap)],
]

const failedChecks = checks.filter(([, passed]) => !passed).map(([name]) => name)

if (failedChecks.length > 0) {
  throw new Error(`SEO checks failed: ${failedChecks.join(', ')}`)
}

console.log('SEO files verified in dist.')
