// 生成流星的函数
function createMeteors() {
    const meteorContainer = document.querySelector('.meteor-container');
    const numMeteors = 30; // 流星数量

    for (let i = 0; i < numMeteors; i++) {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');

        // 随机设置流星的位置、动画时长、延迟、宽度、高度、透明度和旋转角度
        const left = Math.random();
        const top = Math.random();
        const duration = Math.random();
        const delay = Math.random();
        const width = Math.random();
        const height = Math.random();
        const opacity = Math.random();
        const rotation = Math.random();

        meteor.style.setProperty('--random-left', left);
        meteor.style.setProperty('--random-top', top);
        meteor.style.setProperty('--random-duration', duration);
        meteor.style.setProperty('--random-delay', delay);
        meteor.style.setProperty('--random-width', width);
        meteor.style.setProperty('--random-height', height);
        meteor.style.setProperty('--random-opacity', opacity);
        meteor.style.setProperty('--random-rotation', rotation);

        meteorContainer.appendChild(meteor);
    }
}

// 页面加载完成后生成流星
window.addEventListener('load', createMeteors);