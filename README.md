# 敏感信息掩码

敏感的数据信息要求在传输或展示等方面需要进行掩码处理，这个库就是为此而编写的。

| 类型         | 是否支持（✅ /❎） |
| ------------ | ------------------ |
| 字符串       | ✅                 |
| 结构数据     | ✅                 |        |

## 安装

> npm、pnpm、yarn 任意一种随你选择

```bash
pnpm i mask-simple-sensitive
```

## 使用方式
```ts
import { maskText, maskObject} from 'mask-simple-sensitive';

// 字符串掩码 内部预设：all、name ...等等
maskText('123', 'all'); // 输出：***

// 结构数据掩码：自定义规则
const source = {firstNum: '123456',otherNum: {resultNum: '123',name: '小明'}};
maskObject(source, { '^.*Num$': 'all', '^otherNum\.name$': 'name'  })
// 将所有带Num结尾的字段进行全掩码，对otherNum.name字段进行精准匹配，使用name预设掩码。
// 输出：{firstNum: '******',otherNum: {resultNum: '***',name: '*明'}}
```

## 更多使用，待后续文档补充
