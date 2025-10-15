document.addEventListener('DOMContentLoaded', () => {
    const thumbnailData = [
         'w30', 'citywalk1', 'indoor', 'citywalk2', 'citywalk3', 'walking_daytime', 'go5', 'dance3'
    ];

    const thumbnailsHtml = thumbnailData.map(name => `
        <img src="static/thumbs/${name}.jpg" 
             data-video="static/videos/vis_pts/${name}.mp4"
             class="thumbnail pts-thumbnail" 
             alt="${name}" 
             style="cursor: pointer; width: 100px;">
    `).join('');

    const content = `
        <div class="container" style="max-width: 95%; width: 95%;">
            <div class="columns is-centered has-text-centered">
                <div class="column is-full panel-style">
                    <div class="video-container" style="width: 100%; max-width: none;">
                        <div class="video-display-container" style="display: flex; justify-content: center; width: 100%;">
                            <div id="video-container" style="width: 95%; position: relative; background-color: white; aspect-ratio: 16/9;">
                                <video id="main-video" controls autoplay muted loop playsinline disablePictureInPicture style="width: 100%; height: 100%; object-fit: contain; background-color: white;">
                                    <source id="main-video-source" type="video/mp4">
                                </video>
                                <div id="video-placeholder" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: white; display: none; align-items: center; justify-content: center; color: #666; font-size: 16px;">
                                    Loading...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="thumbnail-container">
                        ${thumbnailsHtml}
                    </div>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .thumbnail {
            border-radius: 6px;
            border: 2px solid #fff;
            box-shadow: 0 0 4px #888;
            width: 100px;
            height: 70px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        .thumbnail:hover { transform: scale(1.1); }
        .video-label {
            font-size: 1.3rem;
            font-weight: bold;
            margin: 0 20px;
        }
    `;
    document.head.appendChild(style);

    const section = document.getElementById('pts-vis');
    section.innerHTML = content;
    section.style.display = 'block';

    const mainVideoElement = document.getElementById('main-video');
    const mainVideoSource = document.getElementById('main-video-source');
    const thumbnails = document.querySelectorAll('.pts-thumbnail');

    mainVideoElement.loop = true;

    thumbnails[0].style.border = '3px solid #92A8D1';
    mainVideoSource.src = thumbnails[0].dataset.video;
    mainVideoElement.load();


    const customSpeedMap = {
        'dance3': 1.5,
        'go': 1.5,
        'go5': 1.5,
        'taylor': 3.0,
        'citywalk1': 4.0,
        'citywalk2': 4.0,
        'citywalk3': 4.0,
        'w30': 10.0,
        'indoor': 2.5,
    };
    
    const targetDuration = 10;
    
    
    function setVideoPlaybackRate(videoElement, videoName, callback) {
        if (customSpeedMap[videoName]) {
            const customSpeed = customSpeedMap[videoName];
            videoElement.playbackRate = customSpeed;
            
            console.log(`${videoName} Using custom playback speed: ${customSpeed}x`);
            
            if (callback) callback();
            return;
        }
        
        
        new Promise(resolve => {
            if (videoElement.readyState >= 1) {
                resolve();
            } else {
                videoElement.addEventListener('loadedmetadata', resolve, { once: true });
            }
        }).then(() => {
            const duration = videoElement.duration;
            
            if (duration && duration > 0) {
                const adaptiveSpeed = Math.max(0.5, Math.min(10, duration / targetDuration));
                
                videoElement.playbackRate = adaptiveSpeed;
                
                setTimeout(() => {
                    if (Math.abs(videoElement.playbackRate - adaptiveSpeed) > 0.01) {
                        videoElement.playbackRate = adaptiveSpeed;
                    }
                }, 50);
                
                console.log(`${videoName} Adaptive playback speed - video duration: ${duration.toFixed(2)}s, playback speed: ${adaptiveSpeed.toFixed(2)}x, estimated playback duration: ${(duration / adaptiveSpeed).toFixed(2)}s`);
            } else {
                videoElement.playbackRate = 1.0;
            }
            
            if (callback) callback();
        }).catch(error => {
            console.warn('Error setting playback speed:', error);
            videoElement.playbackRate = 1.0;
            if (callback) callback();
        });
    }

    const firstVideoName = thumbnailData[0];
    setVideoPlaybackRate(mainVideoElement, firstVideoName);

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            if (thumbnail.style.border.includes('3px solid')) {
                return;
            }
            
            thumbnails.forEach(t => t.style.border = '2px solid #fff');
            thumbnail.style.border = '3px solid #92A8D1';
            
            const videoPlaceholder = document.getElementById('video-placeholder');
            videoPlaceholder.style.display = 'flex';
            
            mainVideoElement.pause();
            
            mainVideoElement.style.opacity = '0';
            
            mainVideoSource.src = thumbnail.dataset.video;
            mainVideoElement.load();
            
            Promise.all([
                new Promise(resolve => mainVideoElement.addEventListener('loadeddata', resolve, { once: true })),
                new Promise(resolve => mainVideoElement.addEventListener('canplay', resolve, { once: true }))
            ]).then(() => {
                setTimeout(() => {
                    videoPlaceholder.style.display = 'none';
                    mainVideoElement.style.opacity = '1';
                }, 50);
                
                mainVideoElement.loop = true;
                
                const videoName = thumbnail.alt;
                setVideoPlaybackRate(mainVideoElement, videoName, () => {
                    mainVideoElement.play().catch(() => {});
                });
            }).catch(error => {
                console.warn('Error loading video:', error);
                videoPlaceholder.style.display = 'none';
            });
        });
    });

});