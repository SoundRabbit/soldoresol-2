/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      // typeof window !== 'undefined' が恒等式にされてしまうので、 typeof Window を評価する
      test: /\.(ts|js)$/,
      loader: 'string-replace-loader',
      options: {
        search: /typeof\s+window\s*(!==|===|!=|==)\s*['"]undefined['"]/,
        replace: "typeof Window $1 'undefined'",
      },
    });
    return config;
  },
};

export default nextConfig;
