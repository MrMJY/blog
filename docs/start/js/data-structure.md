## 扁平对象数组转换成树形结构（比较常用）
```js
function transformTree (list, options = {}) {
    const {
        keyField = 'id',
        childField = 'children',
        parentField = 'parent'
    } = options

    const tree = []
    const record = {}

    for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i]
        const id = item[keyField]

        if (!id) {
            continue
        }

        if (record[id]) {
            item[childField] = record[id]
        } else {
            item[childField] = record[id] = []
        }

        if (item[parentField]) {
            const parentId = item[parentField]

            if (!record[parentId]) {
                record[parentId] = []
            }

            record[parentId].push(item)
        } else {
            tree.push(item)
        }
    }

    return tree
}
```

## 树形结构快速扁平化（比较常用）