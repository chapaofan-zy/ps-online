//字符串转为数组
export function splitStr(str) {
    let res = [str[0]]
    for (let i = 1; i < str.length; i++) {
        if (str[i] === ' ') continue
        if (!isNaN(str[i] * 1)) {
            if (!isNaN(res[res.length - 1] * 1)) {
                res[res.length - 1] = res[res.length - 1] + str[i]
            } else {
                res.push(str[i])
            }
        } else if (str[i] === '-' || str[i] === '+' || str[i] === '*' || str[i] === '/' || str[i] === '(' || str[i] === ')') {
            res.push(str[i])
        } else {
            return []
        }
    }
    return res
}
//判断优先级
export let priority = (function() {
        const ADD = 1;
        const SUB = 1;
        const MUL = 2;
        const DIV = 2;
        return (operation) => {
            let result = 0;
            switch (operation) {
                case '+':
                    result = ADD;
                    break;
                case '-':
                    result = SUB;
                    break;
                case '*':
                    result = MUL;
                    break;
                case '/':
                    result = DIV;
                    break;
                default:
                    ;
            }
            return result
        }
    })()
    //中序转逆波兰表达式
export function parseArr(arr) {
    let s1 = [],
        s2 = []
    arr.map(e => {
        //console.log(s2);
        if (!isNaN(e * 1)) {
            s2.push(e)
        } else if (e === '(') {
            s1.push(e)
        } else if (e === ')') {
            while (s1[s1.length - 1] !== '(') {
                s2.push(s1.pop())
            }
            s1.pop()
        } else {
            while (s1.length !== 0 && priority(e) <= priority(s1[s1.length - 1])) {
                s2.push(s1.pop())
            }
            s1.push(e)
        }
    })
    while (s1.length > 0) {
        s2.push(s1.pop())
    }
    return s2
}
//计算后缀表达式
export function cal(arr) {
    let res = []
    arr.map(e => {
        if (!isNaN(e)) {
            res.push(e)
        } else {
            let b = res.pop() * 1
            let a = res.pop() * 1
            let t = 0
            if (isNaN(t)) return false
            if (e === '+') {
                t = a + b
            } else if (e === '-') {
                t = a - b
            } else if (e === '*') {
                t = a * b
            } else if (e === '/') {
                t = a / b
            }
            res.push(t)
        }
    })
    return res[0]
}