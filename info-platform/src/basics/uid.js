/**
 * File Name: uid
 */
// let now = +new Date();
let index = 0;

function uid() {
    return `${++index}`;
}
export default uid;