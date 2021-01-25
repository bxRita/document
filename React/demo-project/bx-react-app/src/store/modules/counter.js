// Reducer   基于原有state根据action得到新的state值
function counter(state = 0, action) {
    switch (action.type) {
        case 'increase':
            return state + 1;
        case 'decrease':
            return state - 1;
        default:
            return state
    }
}

export default counter;