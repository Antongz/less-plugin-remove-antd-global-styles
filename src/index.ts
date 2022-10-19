import Less from 'less'
import path from 'path'

// ref: less-plugin-module-resolver
// https://github.com/bundle-matters/less-plugin-module-resolver/blob/main/src/alias-file-manager.ts

export class LessPluginRemoveAntdGlobalStyles implements Less.Plugin {
  constructor() {}

  public install(less: LessStatic, pluginManager: Less.PluginManager): void {
    pluginManager.addFileManager(new AliasFileManager())
  }
}

class AliasFileManager extends Less.FileManager {
  constructor() {
    super()
  }
  public supports(
    filename: string,
    currentDirectory: string,
    options: Less.LoadFileOptions,
    environment: Less.Environment
  ): boolean {
    if (filename.includes('global')) {
      // match antd global style file
      const fullPath = path.join(currentDirectory, filename)
      if (
        fullPath.includes('antd/es/style/core/global') ||
        fullPath.includes('antd/lib/style/core/global')
      ) {
        return true
      }
    }
    return false
  }

  public async loadFile(
    filename: string,
    currentDirectory: string,
    options: Less.LoadFileOptions,
    environment: Less.Environment
  ): Promise<Less.FileLoadResult> {
    return {
      filename: 'dummy-empty-global-style.less',
      contents: '',
    }
  }
}