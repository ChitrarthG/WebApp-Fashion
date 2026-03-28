import React from "react";
import "./Services.css";

// Maps Services slug → backend category slug (or '' for show-all)
const SLUG_TO_CATEGORY = {
  ss26:     'ss26',
  women:    'women',
  men:      'men',
  kids:     'kids',
  home:     'home-living',
  footwear: 'footwear',
  beauty:   'beauty',
};

const categories = [
  {
    name: "SS26",
    slug: "ss26",
    listingPreset: {},
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80&fit=crop",
  },
  {
    name: "Women",
    slug: "women",
    listingPreset: {
      subCategory: 'Dresses',
      occasion: 'Casual',
      categoryQuery: 'dresses casual',
      sort: 'rating_desc',
    },
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&fit=crop",
  },
  {
    name: "Men",
    slug: "men",
    listingPreset: {
      subCategory: 'Shirts',
      occasion: 'Formal',
      categoryQuery: 'shirts formal',
      sort: 'rating_desc',
    },
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80&fit=crop",
  },
  {
    name: "Kids",
    slug: "kids",
    listingPreset: {
      subCategory: 'T-Shirts',
      occasion: 'Casual',
      categoryQuery: 't-shirts casual',
      sort: 'rating_desc',
    },
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80&fit=crop",
  },
  {
    name: "Home",
    slug: "home",
    listingPreset: {
      subCategory: 'Decor',
      categoryQuery: 'decor',
      sort: 'rating_desc',
    },
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=600&q=80&fit=crop",
  },
  {
    name: "Footwear",
    slug: "footwear",
    listingPreset: {
      subCategory: 'Sneakers',
      categoryQuery: 'sneakers',
      sort: 'rating_desc',
    },
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&fit=crop",
  },
  {
    name: "Beauty",
    slug: "beauty",
    listingPreset: {
      subCategory: 'Makeup',
      categoryQuery: 'makeup',
      sort: 'rating_desc',
    },
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80&fit=crop",
  },
];

const campaigns = [
  {
    title: "Bloom & Beyond",
    subtitle: "Subtle florals & summer hues",
    cta: "SHOP NOW",
    href: "#women",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1000&q=80&fit=crop",
  },
  {
    title: "Muted Mirage",
    subtitle: "Soft neutrals for a refined spring",
    cta: "SHOP NOW",
    href: "#men",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000&q=80&fit=crop",
  },
];

const Services = ({ sectionNumber = '01', onNavigateToCategory }) => (
  <section className="categories-section" id="categories" title={sectionNumber}>

    <div className="categories-strip">
      {categories.map((cat) => (
        <a
          key={cat.slug}
          href={`#${cat.slug}`}
          className="category-card"
          onClick={(e) => {
            e.preventDefault();
            const categorySlug = SLUG_TO_CATEGORY[cat.slug] || cat.slug;
            if (onNavigateToCategory) onNavigateToCategory(categorySlug, cat.listingPreset || {});
          }}
        >
          <img src={cat.image} alt={cat.name} className="category-image" loading="lazy" />
          <span className="category-label">{cat.name}</span>
        </a>
      ))}
    </div>

    <div className="campaigns-grid">
      {campaigns.map((campaign) => (
        <article key={campaign.title} className="campaign-card">
          <img src={campaign.image} alt={campaign.title} className="campaign-image" loading="lazy" />
          <div className="campaign-caption">
            <h3>{campaign.title}</h3>
            <p>{campaign.subtitle}</p>
            <a href={campaign.href}>{campaign.cta}</a>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export { SLUG_TO_CATEGORY };
export default Services;
