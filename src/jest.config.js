module.exports = {
    // …your other Jest config…
    moduleNameMapper: {
      // Mock all CSS imports to an identity proxy (so className lookups still work)
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
    }
  };
  