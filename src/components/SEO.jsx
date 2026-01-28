import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Synergy - Smart Parking System",
            "applicationCategory": "MapsAndNavigationApplication",
            "operatingSystem": "Android, iOS",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "VND"
            }
          }
        `}
      </script>
    </Helmet>
  );
};

export default SEO;
