export interface AuthorRef {
  "@type": "Person" | "Organization";
  name: string;
  url?: string;
}

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  inLanguage: string;
  author?: AuthorRef;
}

export interface BlogPostingSchema {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
  author?: AuthorRef;
  mainEntityOfPage: { "@type": "WebPage"; "@id": string };
  inLanguage?: string;
}

export function websiteSchema(input: {
  name: string;
  url: string;
  inLanguage?: string;
  author?: AuthorRef;
}): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    inLanguage: input.inLanguage ?? "en",
    ...(input.author ? { author: input.author } : {}),
  };
}

export function blogPostingSchema(input: {
  headline: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
  author?: AuthorRef;
  canonical: string;
  inLanguage?: string;
}): BlogPostingSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    datePublished: input.datePublished,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.author ? { author: input.author } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": input.canonical },
    inLanguage: input.inLanguage ?? "en",
  };
}
