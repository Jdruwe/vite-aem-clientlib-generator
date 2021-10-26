module.exports = {
  libs: [
    {
      manifest: 'outDir/manifest.json',
      resourcesDir: 'outDir/etc.clientlibs/project/clientlibs/demo-clientlib/resources',
      clientlibDir: 'clientlib-demo',
      categories: ['demo-category'],
      properties: {
        moduleIdentifier: 'vite',
      },
    },
  ],
}
