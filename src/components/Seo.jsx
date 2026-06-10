import { useEffect } from 'react'

const SITE_URL = 'https://www.projektlyoon.com'
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function upsertJsonLd(id, data) {
  let element = document.head.querySelector(`#${id}`)

  if (!element) {
    element = document.createElement('script')
    element.id = id
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(data)
}

function Seo({
  title,
  description,
  path = '/',
  type = 'website',
  image = DEFAULT_IMAGE,
  jsonLd,
}) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path}`

    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical })

    if (jsonLd) {
      upsertJsonLd('route-jsonld', jsonLd)
    }
  }, [description, image, jsonLd, path, title, type])

  return null
}

export default Seo
