interface Env {
  ASSETS: { fetch: (req: Request | string) => Promise<Response> };
}

// 纯静态资源站：直接由 Worker 把请求转发给绑定的 ASSETS（VitePress 构建产物）。
export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return env.ASSETS.fetch(request);
  },
};
