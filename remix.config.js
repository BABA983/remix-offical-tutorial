/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002,
  async routes(defineRoutes) {
    return defineRoutes((route) => {
      // route("test/:path", "routes/test/index.tsx", () => {
      route("test/haha", "routes/test/index.tsx", () => {
        route("relative/child1", "routes/test/child.tsx");
        route("relative/child2", "routes/test/child2.tsx");
      });
    });
  },
};
