document.addEventListener('DOMContentLoaded', function() {
    // 为vs_mon部分设置交互
    setupCompareSection(
        'left-iframe', 
        'right-iframe', 
        '.viser-thumbnail', 
        'compare-description'
    );
    
    // 为vs_das部分设置交互
    setupCompareSection(
        'left-iframe-das', 
        'right-iframe-das', 
        '.viser-thumbnail-das', 
        'compare-description-das'
    );
    
    // 为cut部分设置交互
    setupCompareSection(
        'left-iframe-cut', 
        'right-iframe-cut', 
        '.viser-thumbnail-cut', 
        'compare-description-cut'
    );
    
    // 添加缩略图样式
    const style = document.createElement('style');
    style.innerHTML = `
        .viser-thumbnail, .viser-thumbnail-das, .viser-thumbnail-cut {
            border-radius: 6px;
            box-shadow: 0 0 4px #888;
            width: 100px;
            height: 70px;
            object-fit: cover;
            transition: transform 0.3s ease;
            vertical-align: bottom;
            cursor: pointer;
        }

        .viser-thumbnail:hover, .viser-thumbnail-das:hover, .viser-thumbnail-cut:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
    
    // 通用设置函数，处理每个部分的交互
    function setupCompareSection(leftIframeId, rightIframeId, thumbnailSelector, descriptionId) {
        const leftIframe = document.getElementById(leftIframeId);
        const rightIframe = document.getElementById(rightIframeId);
        const thumbnails = document.querySelectorAll(thumbnailSelector);
        const compareDescription = document.getElementById(descriptionId);
        
        // 如果元素不存在，则退出
        if (!leftIframe || !rightIframe || thumbnails.length === 0 || !compareDescription) {
            return;
        }
        
        // 设置默认选中的缩略图样式
        thumbnails.forEach(thumbnail => {
            thumbnail.style.border = '2px solid #fff';
        });
        
        // 设置第一个缩略图为蓝色边框（选中状态）
        thumbnails[0].style.border = '3px solid #92A8D1';
        
        // 加载默认的viser路径
        const leftViser = thumbnails[0].getAttribute('data-left-viser');
        const rightViser = thumbnails[0].getAttribute('data-right-viser');
        const description = thumbnails[0].getAttribute('data-description');
        
        // 设置初始iframe源 - 使用完整URL
        leftIframe.src = `http://127.0.0.1:5500/build/?playbackPath=${leftViser}`;
        rightIframe.src = `http://127.0.0.1:5500/build/?playbackPath=${rightViser}`;
        
        // 设置初始描述
        compareDescription.textContent = description;
        
        // 为每个缩略图添加点击事件
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // 更新缩略图样式：所有缩略图恢复白色边框
                thumbnails.forEach(t => {
                    t.style.border = '2px solid #fff';
                });
                
                // 当前点击的缩略图设置为蓝色边框
                this.style.border = '3px solid #92A8D1';
                
                // 获取viser路径
                const leftViser = this.getAttribute('data-left-viser');
                const rightViser = this.getAttribute('data-right-viser');
                const description = this.getAttribute('data-description');
                
                // 更新iframe源 - 使用完整URL
                leftIframe.src = `http://127.0.0.1:5500/build/?playbackPath=${leftViser}`;
                rightIframe.src = `http://127.0.0.1:5500/build/?playbackPath=${rightViser}`;
                
                // 更新描述
                compareDescription.textContent = description;
            });
        });
    }
}); 