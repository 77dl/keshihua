// 全国温度可视化大屏更新版(1)/js/rain.js
// 生成雨滴的函数
function createRainDrops() {
  const rainContainer = document.querySelector('.rain-container');
  const numDrops = 100; // 雨滴数量

  for (let i = 0; i < numDrops; i++) {
      const drop = document.createElement('div');
      drop.classList.add('rain-drop');

      // 随机设置雨滴的位置和动画时长
      const left = Math.random() * 100 + '%';
      const duration = Math.random() * 2 + 1 + 's';
      const delay = Math.random() * 2 + 's';

      // 随机生成颜色
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8)`;

      drop.style.left = left;
      drop.style.animationDuration = duration;
      drop.style.animationDelay = delay;
      // 应用随机颜色
      drop.style.background = randomColor;

      rainContainer.appendChild(drop);
  }
}

// 页面加载完成后生成雨滴
window.addEventListener('load', createRainDrops);