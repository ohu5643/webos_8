export default class WindowManager {
    constructor() {
        this.zIndex = 100;
    }

    createWindow(title, content) {
        const windowEl = document.createElement('div');

        windowEl.className = 'window';

        windowEl.innerHTML = `
            <div class="window-header">
                <span>${title}</span>

                <div class="window-buttons">
                    <button class="close-btn">✕</button>
                </div>
            </div>

            <div class="window-content">
                ${content}
            </div>
        `;

        windowEl.style.left = '100px';
        windowEl.style.top = '100px';
        windowEl.style.zIndex = this.zIndex++;

        document.getElementById('desktop').appendChild(windowEl);

        this.makeDraggable(windowEl);

        windowEl.addEventListener('mousedown', () => {
            windowEl.style.zIndex = this.zIndex++;
        });

        windowEl
            .querySelector('.close-btn')
            .addEventListener('click', () => {
                windowEl.remove();
            });

        return windowEl;
    }

    makeDraggable(windowEl) {
        const header = windowEl.querySelector('.window-header');

        let dragging = false;

        let offsetX = 0;
        let offsetY = 0;

        header.addEventListener('mousedown', (e) => {
            dragging = true;

            offsetX = e.clientX - windowEl.offsetLeft;
            offsetY = e.clientY - windowEl.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;

            windowEl.style.left =
                e.clientX - offsetX + 'px';

            windowEl.style.top =
                e.clientY - offsetY + 'px';
        });

        document.addEventListener('mouseup', () => {
            dragging = false;
        });
    }
}