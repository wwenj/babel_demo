const { TEXT_BABEL } = window.data
const POLL_INTERVAL = 200;

let io = null;

const observeStack = new Map();

let realTmp = new Map();

function callback(queue) {
    const queueTmp = [];
    queue
        .filter((item) => item.isIntersecting)
        .forEach(({ intersectionRatio, target: elem }) => {
            // IntersectionObserver 标准实现可能，display:none 检测不到
            if (window.getComputedStyle(elem).display === 'none') return;
            const fn = observeStack.get(elem);

            io.unobserve(elem);

            // 对可视区域漏出百分比增加保留两位小数的操作，避免有时候完全展现的值是 0.9967 之类的无限接近 1 的数字
            intersectionRatio = Math.round(intersectionRatio * 100) / 100;
            if (fn.real) {
                io.observe(elem);
                const { intersectionRatio: customIntersectionRatio = 1 } = fn.options || {};
                if (intersectionRatio < customIntersectionRatio) return;
                return queueTmp.push(elem);
            }
            observeStack.delete(elem);

            fn();
        });

    handleReal(queueTmp);
}

function handleReal(queue) {
    const tmp = new Map();
    queue.forEach((item) => {
        const time = +new Date();
        const itemTime = realTmp.get(item) || time;
        const fn = observeStack.get(item);

        const realShowDelayTimeOption = fn.options && fn.options.realShowDelayTime;

        const realShowDelayTime = realShowDelayTimeOption || 2000;

        if (time - itemTime >= realShowDelayTime) {
            delete fn.real;
            return;
        }
        tmp.set(item, itemTime);
    });
    realTmp = tmp;
}

io = new IntersectionObserver(callback);

io.POLL_INTERVAL = POLL_INTERVAL;

const afun = ()=>{
    return 1
}

export default function (dom, fn, real, options) {
    if (!dom && !TEXT_BABEL) {
        return;
    }

    fn.real = real;
    fn.options = options;
    observeStack.set(dom, fn);

    io.observe(dom);
    afun()
    if (TEXT_BABEL) {
        return
    }
}

