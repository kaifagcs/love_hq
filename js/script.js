// 黑客帝国字符雨效果
const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');

// 爱心粒子效果
const heartCanvas = document.getElementById('heartCanvas');
const heartCtx = heartCanvas.getContext('2d');

// 设置画布大小
function resizeCanvas() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  heartCanvas.width = window.innerWidth;
  heartCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  // 重新计算字符雨列数
  const newColumns = Math.floor(matrixCanvas.width / fontSize);
  if (newColumns !== columns) {
    location.reload(); // 屏幕尺寸变化时重新加载页面
  }
});

// ========== 黑客帝国字符雨 ==========
const matrixChars = 'ILOVEYOU我喜欢你'.split('');
const isMobile = window.innerWidth <= 768;
const fontSize = isMobile ? 12 : 16;
const columns = Math.floor(matrixCanvas.width / fontSize);
const drops = Array(columns).fill(1);

function drawMatrix() {
  matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  
  matrixCtx.fillStyle = '#ff77ae';
  matrixCtx.font = fontSize + 'px monospace';
  
  for (let i = 0; i < drops.length; i++) {
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    
    matrixCtx.fillText(text, x, y);
    
    if (y > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 50);

// ========== 爱心粒子效果 ==========
class Particle {
  constructor(x, y, type = 'normal', centerX, centerY) {
    this.x = x;
    this.y = y;
    this.type = type;
    
    // 计算从中心向外的方向
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const dirX = dx / distance;
    const dirY = dy / distance;
    
    if (type === 'outer') {
      // 外层静态粒子 - 不扩散
      this.size = Math.random() * 3 + 2.5;
      this.decay = Math.random() * 0.006 + 0.004;
      this.speedX = (Math.random() - 0.5) * 0.1;
      this.speedY = (Math.random() - 0.5) * 0.1;
    } else if (type === 'inner') {
      // 内层核心粒子 - 向外扩散
      this.size = Math.random() * 2 + 1.5;
      this.decay = Math.random() * 0.006 + 0.004;
      this.speedX = dirX * (Math.random() * 0.5 + 0.3);
      this.speedY = dirY * (Math.random() * 0.5 + 0.3);
    } else if (type === 'innerNormal') {
      // 内层普通粒子 - 向外扩散
      this.size = Math.random() * 2 + 1.5;
      this.decay = Math.random() * 0.008 + 0.006;
      this.speedX = dirX * (Math.random() * 0.4 + 0.25);
      this.speedY = dirY * (Math.random() * 0.4 + 0.25);
    } else {
      // 中层粒子 - 向外扩散
      this.size = Math.random() * 2.5 + 2;
      this.decay = Math.random() * 0.007 + 0.005;
      this.speedX = dirX * (Math.random() * 0.35 + 0.2);
      this.speedY = dirY * (Math.random() * 0.35 + 0.2);
    }
    
    this.life = 1;
    this.initialSize = this.size;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    // 扩散粒子在移动过程中逐渐变大，静态粒子保持大小
    if (this.type !== 'outer') {
      this.size = this.initialSize * (1 + (1 - this.life) * 0.5);
    }
  }
  
  draw() {
    if (this.type === 'outer') {
      // 外层静态粒子 - 清晰的轮廓
      const gradient = heartCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 1.8);
      gradient.addColorStop(0, `rgba(255, 23, 117, ${this.life * 0.95})`);
      gradient.addColorStop(0.4, `rgba(255, 119, 174, ${this.life * 0.7})`);
      gradient.addColorStop(1, `rgba(255, 119, 174, 0)`);
      heartCtx.fillStyle = gradient;
      heartCtx.beginPath();
      heartCtx.arc(this.x, this.y, this.size * 1.8, 0, Math.PI * 2);
      heartCtx.fill();
    } else if (this.type === 'inner') {
      // 内层核心粒子 - 向外扩散
      const gradient = heartCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      gradient.addColorStop(0, `rgba(255, 51, 133, ${this.life * 0.95})`);
      gradient.addColorStop(0.3, `rgba(255, 119, 174, ${this.life * 0.7})`);
      gradient.addColorStop(1, `rgba(255, 119, 174, 0)`);
      heartCtx.fillStyle = gradient;
      heartCtx.beginPath();
      heartCtx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      heartCtx.fill();
    } else if (this.type === 'innerNormal') {
      // 内层普通粒子
      const gradient = heartCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 1.5);
      gradient.addColorStop(0, `rgba(255, 119, 174, ${this.life * 0.75})`);
      gradient.addColorStop(0.5, `rgba(255, 119, 174, ${this.life * 0.4})`);
      gradient.addColorStop(1, `rgba(255, 119, 174, 0)`);
      heartCtx.fillStyle = gradient;
      heartCtx.beginPath();
      heartCtx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      heartCtx.fill();
    } else {
      // 中层粒子
      const gradient = heartCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 1.6);
      gradient.addColorStop(0, `rgba(255, 119, 174, ${this.life * 0.8})`);
      gradient.addColorStop(0.5, `rgba(255, 119, 174, ${this.life * 0.5})`);
      gradient.addColorStop(1, `rgba(255, 119, 174, 0)`);
      heartCtx.fillStyle = gradient;
      heartCtx.beginPath();
      heartCtx.arc(this.x, this.y, this.size * 1.6, 0, Math.PI * 2);
      heartCtx.fill();
    }
  }
}

const particles = [];
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

// 爱心形状函数
function heartShape(t, scale = 15) {
  // 根据屏幕宽度调整爱心大小
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  
  let adjustedScale = scale;
  if (isSmallMobile) {
    adjustedScale = scale * 0.5; // 小屏手机缩小到50%
  } else if (isMobile) {
    adjustedScale = scale * 0.65; // 平板/大屏手机缩小到65%
  }
  
  const x = adjustedScale * 16 * Math.pow(Math.sin(t), 3);
  const y = -adjustedScale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x, y };
}

// 生成爱心粒子
let pulsePhase = 0;
function createHeartParticles() {
  // 根据屏幕大小调整粒子数量
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  
  let outerCount = 5;
  let innerCount = 4;
  let innerNormalCount = 3;
  let normalCount = 2;
  
  if (isSmallMobile) {
    // 小屏手机减少粒子数量
    outerCount = 3;
    innerCount = 2;
    innerNormalCount = 2;
    normalCount = 1;
  } else if (isMobile) {
    // 平板/大屏手机适当减少
    outerCount = 4;
    innerCount = 3;
    innerNormalCount = 2;
    normalCount = 2;
  }
  
  // 脉冲效果 - 周期性增强粒子生成
  pulsePhase += 0.05;
  const pulseStrength = Math.sin(pulsePhase) * 0.5 + 0.5; // 0-1之间波动
  const extraParticles = Math.floor(pulseStrength * (isSmallMobile ? 2 : 4));
  
  // 外层爱心 - 静态轮廓（不扩散）
  for (let i = 0; i < outerCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const pos = heartShape(t, 15);
    const noise = (Math.random() - 0.5) * 6;
    particles.push(new Particle(
      centerX + pos.x + noise,
      centerY + pos.y + noise,
      'outer',
      centerX,
      centerY
    ));
  }
  
  // 内层爱心 - 生成核心粒子（从内层开始向外扩散）
  for (let i = 0; i < innerCount + extraParticles; i++) {
    const t = Math.random() * Math.PI * 2;
    const pos = heartShape(t, 10); // 从更内层开始
    const noise = (Math.random() - 0.5) * 5;
    particles.push(new Particle(
      centerX + pos.x + noise,
      centerY + pos.y + noise,
      'inner',
      centerX,
      centerY
    ));
  }
  
  // 内层爱心 - 生成扩散粒子
  for (let i = 0; i < innerNormalCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const pos = heartShape(t, 11);
    const noise = (Math.random() - 0.5) * 8;
    particles.push(new Particle(
      centerX + pos.x + noise,
      centerY + pos.y + noise,
      'innerNormal',
      centerX,
      centerY
    ));
  }
  
  // 中层粒子 - 向外扩散
  for (let i = 0; i < normalCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const pos = heartShape(t, 12.5);
    const noise = (Math.random() - 0.5) * 6;
    particles.push(new Particle(
      centerX + pos.x + noise,
      centerY + pos.y + noise,
      'normal',
      centerX,
      centerY
    ));
  }
}

function animateHeart() {
  heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
  
  createHeartParticles();
  
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
  
  requestAnimationFrame(animateHeart);
}

animateHeart();
