export const motionAbility = [
    {
        what: 'move',
        options: { dir: 'r', units: 30 }
    }, {
        what: 'move',
        options: { dir: 'l', units: 30 }
    }, {
        what: 'move',
        options: { dir: 'u', units: 30 }
    }, {
        what: 'move',
        options: { dir: 'd', units: 30 }
    }, {
        what: 'turn',
        options: { dir: 'r', deg: 30, reset: false }
    }, {
        what: 'turn',
        options: { dir: 'l', deg: 30, reset: false }
    }, {
        what: 'goto',
        options: { random: true }
    }
];

export const lookAbility = [
    {
        what: 'say',
        default: 'Hello!',
        timed: true,
        time: 2
    },
    //  {
    //     what: 'say',
    //     default: 'Hello!',
    //     timed: false
    // }, 
    {
        what: 'think',
        default: 'Hmm..',
        timed: true,
        time: 2
    },{
        what: 'resize',
        definite: true,
        to: 110
    }, {
        what: 'resize',
        definite: false,
        to: 10
    }
];

export const eventAbility = [
    { what: 'flag' },
    { what: 'sprite' }
];

export const controlAbility = [
    {
        what: 'wait',
        for: 1
    }, {
        what: 'repeat',
        times: 10,
        actionData: []
    }, {
        what: 'forever',
        actionData: []

    }
];