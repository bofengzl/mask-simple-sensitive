import maskText, { MaskConfig } from './text';
type FieldHander= (value: number|string, pathAr?: any[]) => string;

/**
 * 递归掩码json数据
 * @param obj 需要递归掩码的json数据
 * @param config 根据字段keyPath匹配得掩码规则
 * @returns
 */
export default function maskObject(
  obj: Record<string, any> | any[],
  config: Record<string, MaskConfig | FieldHander>,
) {
  return recursiveObject(obj, config, []);
}
/**
 * 递归处理对象，支持掩码和自定义处理
 *
 * @param obj 待处理对象
 * @param config 配置项，键为路径，值为掩码配置或字段处理函数
 * @param pathArr 路径数组，默认为空数组
 * @returns 处理后的对象
 */
function recursiveObject(
  obj: any,
  config: Record<string, MaskConfig | FieldHander>,
  pathArr: any[] = [],
) {
  if (typeof obj !== 'object') {
    return handleValue(obj, config, pathArr);
  }
  
  const newObj: Record<string, any> = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach((key) => {
    // 记录key路径
    pathArr.push(key);
    newObj[key] = recursiveObject(obj[key], config, pathArr);
    pathArr.pop();
  });
  return newObj;
}

/**
 * 处理基本类型值
 *
 * @param value 待处理值
 * @param config 配置对象
 * @param pathArr 路径数组
 * @returns 处理后的值
 */
function handleValue(value: any, config: Record<string, MaskConfig | FieldHander>, pathArr: any[]): any {
  if (typeof value === 'number' || typeof value === 'string') {
    const maskType = config[Object.keys(config).find(key => new RegExp(key).test(pathArr.join('.')))];
    if (typeof maskType === 'function') {
      // 自定义方法
      return maskType(value, pathArr);
    }
    if (maskType) {
      // 使用默认掩码方法
      return maskText(value.toString(), maskType as MaskConfig);
    }
  }
  
  return value;
}
