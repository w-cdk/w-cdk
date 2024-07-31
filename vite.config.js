import { defineConfig } from 'vite';
import wcdkPlugin from './plugins/wcdk-plugin';
import path from 'path';

export default defineConfig({
  plugins: [wcdkPlugin()],
  resolve: {
    alias: {
      'w-cdk': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.wcdk', '.css']
  },
  server: {
    open: '/examples/counter/index.html'
  }
});
