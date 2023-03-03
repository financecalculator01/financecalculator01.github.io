import * as walk from "./acorn-walker.js"

const input = document.getElementById("acorn-input");

window.evaluate = (input) =>
{

    const options = acorn.defaultOptions + acorn.defaultOptions.ecmaVersion

    const ast = acorn.parse(input.value, options)
    const interpreter = new Interpreter(new Visitor());
    const message = interpreter.interpret(ast);
    return message

}

input.addEventListener("keyup", function (event)
{
    if (event.key === "Enter")
    {
        const options = acorn.defaultOptions + acorn.defaultOptions.ecmaVersion

        const ast = acorn.parse(input.value, options)
        const interpreter = new Interpreter(new Visitor());
        const message = interpreter.interpret(ast);
        alert(message);
    }
})

class Interpreter
{
    constructor(visitor)
    {
        this.visitor = visitor
    }

    interpret(nodes)
    {
        l(nodes)
        return this.visitor.run(nodes.body)
    }
}

const l = console.log
const ops = {
    ADD: '+',
    SUB: '-',
    MUL: '*',
    DIV: '/'
}
let globalScope = new Map()

class Visitor
{
    visitVariableDeclaration(node)
    {
        const nodeKind = node.kind
        return this.visitNodes(node.declarations)
    }

    visitVariableDeclarator(node)
    {
        const id = this.visitNode(node.id)
        const init = this.visitNode(node.init)
        globalScope.set(id, init)
        return init
    }

    visitIdentifier(node)
    {
        const name = node.name
        if (globalScope.get(name))
            return globalScope.get(name)
        else
            return name
    }

    visitLiteral(node)
    {
        return node.raw
    }

    visitBinaryExpression(node)
    {
        const leftNode = this.visitNode(node.left)
        const operator = node.operator
        const rightNode = this.visitNode(node.right)
        switch (operator)
        {
            case ops.ADD:
                return currency(leftNode).add(currency(rightNode)).value
            case ops.SUB:
                return currency(leftNode).subtract(currency(rightNode)).value
            case ops.DIV:
                return currency(leftNode).divide(currency(rightNode)).value
            case ops.MUL:
                return currency(leftNode).multiply(currency(rightNode)).value
        }
    }

    evalArgs(nodeArgs)
    {
        let g = []
        for (const nodeArg of nodeArgs)
        {
            g.push(this.visitNode(nodeArg))
        }
        return g
    }

    visitCallExpression(node)
    {
        const callee = this.visitIdentifier(node.callee)
        const _arguments = this.evalArgs(node.arguments)
        if (callee == "print")
            l(..._arguments)
    }

    visitNodes(nodes)
    {
        let value
        for (const node of nodes)
        {
            value = this.visitNode(node)
        }
        return value
    }

    visitExpressionStatement(node)
    {
        return this.visitNode(node.expression)
    }

    visitNode(node)
    {
        switch (node.type)
        {
            case 'VariableDeclaration':
                return this.visitVariableDeclaration(node)
            case 'VariableDeclarator':
                return this.visitVariableDeclarator(node)
            case 'Literal':
                return this.visitLiteral(node)
            case 'Identifier':
                return this.visitIdentifier(node)
            case 'ExpressionStatement':
                return this.visitExpressionStatement(node)
            case 'BinaryExpression':
                return this.visitBinaryExpression(node)
            case "CallExpression":
                return this.visitCallExpression(node)
        }
    }

    run(nodes)
    {
        return this.visitNodes(nodes)
    }
}
