import { dedent } from '@/utils'

export const getTemplateCustomCode = (t) => {
  switch (t) {
    case 'flying-text':
      return dedent`
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            const text = document.createElement('div');
            text.textContent = 'Flying Text';
            text.style.position = 'absolute';
            text.style.zIndex = '9999';
            text.style.fontSize = '24px';
            text.style.fontWeight = 'bold';
            text.style.color = 'green';
            document.body.insertBefore(text, document.body.firstChild);
        
            let x = 0;
            setInterval(() => {
              x = (x + 1) % window.innerWidth;
              text.style.left = x + 'px';
            }, 10);
          });
        </script>
      `;
    case 'ball-game':
      return dedent`
      <script>
        document.addEventListener("DOMContentLoaded", () => {
          !function () {
            const t = document.createElement("canvas");
            t.width = window.innerWidth, t.height = window.innerHeight, t.style.position = "fixed", t.style.zIndex = "9999", t.style.top = "0", t.style.left = "0", document.body.prepend(t);
            const e = t.getContext("2d"), n = [];
            function o(t, e, n, i) { return Math.sqrt((t - n) ** 2 + (e - i) ** 2) }
            function r() {
              e.clearRect(0, 0, t.width, t.height), n.forEach((i, r) => {
                e.beginPath(), e.arc(i.x, i.y, i.radius, 0, 2 * Math.PI, !1), e.fillStyle = "#0095DD", e.fill(), i.x += i.vx, i.y += i.vy;
                const c = o(i.x, i.y, mouseX, mouseY);
                c < i.radius + 5 && (i.vx = (i.x - mouseX) / c * 5, i.vy = (i.y - mouseY) / c * 5), (i.x + i.radius > t.width || i.x - i.radius < 0) && (i.vx *= -1), (i.y + i.radius > t.height || i.y - i.radius < 0) && (i.vy *= -1)
              }), requestAnimationFrame(r)
            }
            let mouseX = 0, mouseY = 0;
            t.addEventListener("mousemove", (t) => { mouseX = t.clientX, mouseY = t.clientY }), t.addEventListener("click", (t) => { n.push({ x: t.clientX, y: t.clientY, radius: 10, vx: 2, vy: 2 }) }), r()
          }()
        });
      </script>
      `;
    case 'snowfall':
      return dedent`
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const flakes = [];
          const numFlakes = 150;
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          let w = canvas.width = window.innerWidth;
          let h = canvas.height = window.innerHeight;
          canvas.style.position = 'fixed';
          canvas.style.zIndex = '9999';
          canvas.style.pointerEvents = 'none';
          document.body.insertBefore(canvas, document.body.firstChild);
      
          window.addEventListener('resize', () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
          });
      
          function createSnowFlake() {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const speed = Math.random() * 5 + 1;
            const radius = Math.random() * 4 + 1;
            return {x, y, speed, radius};
          }
      
          function initSnowFlakes() {
            for (let i = 0; i < numFlakes; i++) {
              flakes.push(createSnowFlake());
            }
          }
      
          function drawSnowFlakes() {
            context.clearRect(0, 0, w, h);
            context.fillStyle = 'white';
            context.beginPath();
            for (let i = 0; i < flakes.length; i++) {
              const flake = flakes[i];
              context.moveTo(flake.x, flake.y);
              context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true);
            }
            context.fill();
            moveSnowFlakes();
          }
      
          function moveSnowFlakes() {
            for (let i = 0; i < flakes.length; i++) {
              const flake = flakes[i];
              flake.y += flake.speed;
              if (flake.y > h) {
                flake.y = Math.random() * -h;
                flake.x = Math.random() * w;
              }
            }
            requestAnimationFrame(drawSnowFlakes);
          }
      
          initSnowFlakes();
          moveSnowFlakes();
        });
      </script>
    `;
  case 'rainbow':
    return dedent`
      <script>
        const css = document.createElement('style');
        css.innerText = \`
          * {
            background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        \`;
        document.head.appendChild(css);
      </script>
    `;
    default:
      return '';
  }
}