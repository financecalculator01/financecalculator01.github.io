
const dataField = document.getElementsByTagName("textarea")[0]
const calculateButton = document.getElementById("calculate")
const clearButton = document.getElementById("clear")

clearButton.addEventListener("click", () =>
{
    confirm("Do you want to clear the data?") && (dataField.value = "")

})

calculateButton.addEventListener("click", () =>
{
    const data = dataField.value
    if(data)
    {
       calculate(data)
    }

})

/**
 *
 * @param expression {string}
 */
// function evaluate(expression)
// {
//     let total = currency(0)
//     expression = expression.replaceAll("\n","+")
//     let ast = jsep(expression)
//
//         function evaluateAST(ast)
//         {
//             switch (ast.type)
//             {
//                 case "BinaryExpression":
//                     return evaluateBinaryExpression(ast)
//                 case "UnaryExpression":
//                     return evaluateUnaryExpression(ast)
//                 case "Literal":
//                     return evaluateLiteral(ast)
//                 case "Identifier":
//                     return evaluateIdentifier(ast)
//                 default:
//                     throw new Error("Unknown AST type")
//             }
//         }
//
//         function evaluateBinaryExpression(ast)
//
//
//     })
//
//     return total.value
// }

const input = document.getElementById("acorn-input");

function evaluate(input)
{

    const options = acorn.defaultOptions + acorn.defaultOptions.ecmaVersion

    const ast = acorn.parse(input.value, options)
    const interpreter = new Interpreter(new Visitor());
    return interpreter.interpret(ast)

}


class Interpreter
{
    constructor(visitor)
    {
        this.visitor = visitor
    }

    interpret(nodes)
    {
        l(nodes)
        const result = this.visitor.run(nodes.body);
        alert(`Result: ${result}`)
        return result
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
                                                 sadfdasasdsaadssdadsdasddadssdadsasdsda
    run(nodes)
    {
        return this.visitNodes(nodes)
    }
}

/**
 *
 * @param data {string}
 * @return {string}
 */
function calculate(data)
{

    const options = acorn.defaultOptions + acorn.defaultOptions.ecmaVersion

    const ast = acorn.parse(data, options)
    const interpreter = new Interpreter(new Visitor());
    const message = interpreter.interpret(ast);

    let total = currency(0)
    data = data.replaceAll("\n","+")
    // const evaluate1 = evaluate(data);
    total.add(message)
   //  let split = data.split(/[+\n]/)
   // split.forEach((item) => total = total.add(item))

    l(total.value)
    return  total.value
}

