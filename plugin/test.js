const letToVar = function ({ types: t }) {
    console.log('plugin-------\n',);
    return {
        visitor: {
            // Identifier(path) {
            //     // console.log(path.type, path.node.name);
            //     if (path.node.name === 'TEXT_BABEL') {
            //         console.log(path.node)
            //         // 删除包含目标变量的节点
            //         return path.parentPath.remove();
            //     }
            // },
            ArrowFunctionExpression(path) {
                const { params, body, async, generator } = path.node;

                // 如果箭头函数的body是表达式，将其包装成块级语句
                const bodyNode = t.isBlockStatement(body) ? body : t.blockStatement([t.returnStatement(body)]);

                // 创建一个普通的函数节点
                const functionNode = t.functionDeclaration(
                    path.parent.id, // 使用箭头函数的父节点的标识符作为新函数的名字
                    params,
                    bodyNode,
                    async,
                    generator
                );

                // 替代原来的箭头函数节点
                path.replaceWith(functionNode);
            },
        // CallExpression(path) {
        //     if (path.node.callee && t.isIdentifier(path.node.callee.object, { name: 'console' })) {
        //         path.remove();
        //     }
        // }
    }
};
};

module.exports = letToVar