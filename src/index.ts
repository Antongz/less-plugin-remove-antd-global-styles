import Less from 'less'
import path from 'path';
import { normalizePath } from './utils';

// ref: less-plugin-module-resolver
// https://github.com/bundle-matters/less-plugin-module-resolver/blob/main/src/alias-file-manager.ts

export class LessPluginRemoveAntdGlobalStyles implements Less.Plugin {
  install(less: LessStatic, pluginManager: Less.PluginManager): void {
    pluginManager.addFileManager(new FileManager());
  }
}

class FileManager extends Less.FileManager {
  supports(
    filename: string,
    currentDirectory: string,
    options: Less.LoadFileOptions,
    environment: Less.Environment
  ): boolean {
    if (filename.includes('global')) {
      const fullPath = normalizePath(path.join(currentDirectory, filename));
      const isAntdGlobalStyle =
        fullPath.includes('antd/') || fullPath.includes('ant-design-vue/');
      if (isAntdGlobalStyle) return true;
    }
    return false;
  }

  async loadFile(): Promise<Less.FileLoadResult> {
    return {
      filename: 'dummy-empty-global-style.less',
      contents: '',
    };
  }
}
