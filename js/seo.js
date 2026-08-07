const addSchema = () => {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Free Calculator Tools',
    url: 'https://yogipedhadiya111.github.io/free-calculator-tools/',
    logo: 'https://yogipedhadiya111.github.io/free-calculator-tools/assets/icons/favicon.svg'
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(organization);
  document.head.appendChild(script);
};

document.addEventListener('DOMContentLoaded', addSchema);
