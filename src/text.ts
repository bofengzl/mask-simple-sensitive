import preset from './preset';
type Preset = keyof typeof preset;
export type MaskConfig = Preset | Record<string, [string, string] | Preset>| [string, string];

/**
 * 掩码字符串
 * @param text 需要掩码的字符串
 * @param config  配置，三种格式
 * 
 * 1. 字符串：会匹配对应的预设格式
 * 2. 对象：会根据key匹配text找到对应配置
 * 3. 数组：第一项是正则匹配，第二项是需要替换的值，特殊情况：第二项如{{*$1}}的字符串，会使用*来获取$1的长度
 * 
 * config示例:
 * 'all' → text: 1234567890，输出**********，根据text的长度进行掩码
 * {'^[0-9]$': ['^(.*)$', '***'], '^[a-z]$': ['^(.*)$', '*****']} → text: 1234，输出 ***，text：abcd，输出 *****
 * ['^([0-9]{3})(.*)$', '$1{{$2}}'] → text: 123456789，输出 ******789
 */
export default function maskText(
  text: string,
  config: MaskConfig,
  defaultConfig?: MaskConfig,
) {
  // 获取替换规则
  const finallyConfig = resolveConfig(text, config, defaultConfig);
  // 还是没有符合的配置，则原样返回
  if (!Array.isArray(finallyConfig) || finallyConfig.length !== 2) {
    console.warn(`${JSON.stringify(config)}配置无效，无法掩码`);
    return text;
  }
  // 将数据按照指定规则进行替换
  return replaceText(text, finallyConfig);
}

/**
 * 解析掩码配置
 *
 * @param config - 掩码配置
 * @param defaultConfig - 默认掩码配置
 * @returns 解析后的掩码配置
 */
function resolveConfig(text: string,config: MaskConfig, defaultConfig?: MaskConfig): MaskConfig {
  let finallyConfig = config;
  // 采用预设配置
  if (typeof finallyConfig === 'string') {
    // 找不到预设，用全掩码
    finallyConfig = preset[config as string];
  }
  // 如果是对象，则提取数据
  if (!Array.isArray(finallyConfig) && typeof finallyConfig === 'object') {
    const targetKey = Object.keys(finallyConfig).find(key => new RegExp(key).test(text));
    finallyConfig = finallyConfig[targetKey];
  }
  // 如果匹配出来得还是字符串，还是采用预设
  if (typeof finallyConfig === 'string') {
    finallyConfig = preset[finallyConfig];
  }
  // 最终匹配到应该是数据，如果不是数组，则采用默认配置
  if (!Array.isArray(finallyConfig) || finallyConfig.length !== 2) {
    finallyConfig = defaultConfig;
    // 如果匹配出来得还是字符串，还是采用预设
    if (typeof finallyConfig === 'string') {
      finallyConfig = preset[finallyConfig];
    }
  }
  return finallyConfig;
}

/**
 * 替换文本中的敏感信息
 *
 * @param text - 要替换的文本
 * @param config - 掩码配置
 * @returns 替换后的文本
 */
function replaceText(text: string, config: [string, string]): string {
  const maskData1 = text.toString().replace(new RegExp(config[0]), config[1]);
  const repeatReg = /\{\{([^{}]+)\}\}/g;
  // 替换形如{{*xxx}}的数据，比如{{*123}}替换为***，{{#1234}}替换为####
  return maskData1.replace(repeatReg, (repeatText) => {
    // 替换{{和}}
    const text = repeatText.replace('{{', '').replace('}}', '');
    // 第一个字符作为掩码的字符
    const source = text.substring(1);
    const maskChar = text.substring(0, 1);
    return maskChar.repeat(source.length);
  });
}
