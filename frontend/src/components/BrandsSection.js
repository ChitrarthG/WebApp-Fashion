import React from "react";
import "./BrandsSection.css";

const brands = [
  { name: "Biba",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/BIBA_logo.svg/200px-BIBA_logo.svg.png" },
  { name: "W for Woman",   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/W-for-woman-logo.svg/200px-W-for-woman-logo.svg.png" },
  { name: "Levis",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Levi%27s_logo.svg/200px-Levi%27s_logo.svg.png" },
  { name: "H&M",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/200px-H%26M-Logo.svg.png" },
  { name: "Mango",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Mango_%28clothing%29_logo.svg/200px-Mango_%28clothing%29_logo.svg.png" },
  { name: "Zara",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Zara_Logo_from_2019.svg/200px-Zara_Logo_from_2019.svg.png" },
  { name: "Global Desi",   logo: null },
  { name: "AND",           logo: null },
  { name: "Denver",        logo: null },
  { name: "Jockey",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Jockey_International_logo.svg/200px-Jockey_International_logo.svg.png" },
  { name: "Lee",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Lee_%28jeans%29_logo.svg/200px-Lee_%28jeans%29_logo.svg.png" },
  { name: "Wrangler",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Wrangler_logo.svg/200px-Wrangler_logo.svg.png" },
  { name: "Dorothy Perkins",logo: null },
  { name: "Ajile",         logo: null },
  { name: "Annabelle",     logo: null },
  { name: "Akkriti",       logo: null },
];

// Duplicate for seamless infinite scroll
const marqueeItems = [...brands, ...brands];

export default function BrandsSection({ sectionNumber = '02' }) {
  return (
    <section className="brands-section" title={sectionNumber}>
      <div className="brands-header">
        <h2 className="brands-title">Brands You Love</h2>
        <p className="brands-sub">Curated labels, iconic styles — all under one roof</p>
      </div>

      <div className="brands-track-wrapper">
        <div className="brands-track">
          {marqueeItems.map((brand, i) => (
            <div className="brand-tile" key={`${brand.name}-${i}`}>
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="brand-logo-img"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "block";
                  }}
                />
              ) : null}
              <span
                className="brand-logo-text"
                style={brand.logo ? { display: "none" } : {}}
              >
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
