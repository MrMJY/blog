## Vue3更好的支持Typescript
[官方文档](https://www.javascriptc.com/vue3js/guide/typescript-support.html)

### `tsconfig.json`配置
```json
{
    "compilerOptions": {
        "target": "es5",
        "module": "ES2015",
        "strict": true, // 严格模式，严格校验this
        "jsx": "preserve",  // 允许使用jsx、tsx
        "importHelpers": true,
        "moduleResolution": "node",
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "sourceMap": false,
        "baseUrl": ".",
        "types": ["webpack-env", "jest"], // 全局可用的@types
        "paths": {
            "@/*": ["src/*"] // vue默认的别名 @ 指向 src 目录，ts 不能识别，设置 paths 设置正确的路径
        },
        // 编译过程中需要引入的库文件的列表
        "lib": [
            "es5",
            "dom",
            "dom.iterable",
            "scripthost",
            "es2015.promise",
            "es2015.core"
        ]
    },
    // 编译时只包含src目录下的.ts .tsx .vue文件
    "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.vue"
    ],
    // 编译时排除node_modules
    "exclude": ["node_modules"]
}
```

### 组件的编写（`.vue`）
```vue
<template>...</template>

<!-- 声明script使用的语言是ts -->
<script lang="ts">
// 引入类型注解
import { SearchForm } from "./types";
// 响应式API、顶层函数
import {
    defineComponent,
    ref, reactive,
    onMounted,
    // ...
} from "vue";

export default defineComponent({
    name: "HelloWorld",
    setup() {
        // 使用类型注解 SearchForm
        const searchForm = reactive<SearchForm>({
            issueRuleNo: "",
            issueGrade: undefined
        });

        const tableData = ref([]);
        const getList = () => {
            // 调用借口获取数据
            tableData.value = res.data;
        };

        // 声明周期
        onMounted(getList)

        return {
            searchForm,
            tableData,
            getList
            // ... 响应式变量
        }
    }
})
</script>
```
**书写规范：**

+ 优先参考[风格指南](https://v3.cn.vuejs.org/style-guide/)，优先级A必须遵守，尽量遵守优先级B、优先级C
+ 某些优先级C的内容，应当提升至A级别，例如
  + [组件/实例选项的顺序](https://v3.cn.vuejs.org/style-guide/#%E7%BB%84%E4%BB%B6-%E5%AE%9E%E4%BE%8B%E9%80%89%E9%A1%B9%E7%9A%84%E9%A1%BA%E5%BA%8F%E6%8E%A8%E8%8D%90)
  + [元素attribute的顺序](https://v3.cn.vuejs.org/style-guide/#%E5%85%83%E7%B4%A0-attribute-%E7%9A%84%E9%A1%BA%E5%BA%8F%E6%8E%A8%E8%8D%90)

## TSX
使用