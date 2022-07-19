const eleventyConfig = {}

module.exports = function(eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/compiled-assets/main.js')
  eleventyConfig.addWatchTarget('./src/compiled-assets/main.css')
  eleventyConfig.addPassthroughCopy({ './src/compiled-assets': 'assets' })
  eleventyConfig.addPassthroughCopy('./src/media')
  eleventyConfig.setQuietMode(true);


  return {
    dir: {
      output: 'dist',
      input: 'src',
      includes: 'includes',
      data: 'data',
      layouts: 'layouts'
    },
  };
};
