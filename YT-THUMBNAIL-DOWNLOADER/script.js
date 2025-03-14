// (C) 2025 @75rafi (yt-thumbnail-downloader/script.js) 
//
// Copyright @75rafi https://github.com/75rafi //

function setTitle(text) {
    document.title = text;
}

function getThumbnail() {
    document.body.style.cursor = 'progress';
    document.getElementById('thumbnailImage').style.display = 'none';
    document.getElementById('downloadLink').style.display = 'none';
    document.getElementById('loadingText').style.display = 'block';
    updateProgress(0);
    setTitle("Pobieranie miniaturki...");

    const url = document.getElementById('videoUrl').value;
    const fileFormat = document.getElementById('fileFormat').value;
    const videoId = getYouTubeVideoId(url);

    if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        downloadThumbnail(thumbnailUrl, fileFormat);
    } else {
        handleError("[404] - Film jest niedostępny, lub link jest niepoprawny!");
    }
}

function updateProgress(value) {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = value + '%';
}

function getYouTubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function downloadThumbnail(thumbnailUrl, format) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', thumbnailUrl, true);
    xhr.responseType = 'blob';

    let lastProgressTime = Date.now();

    const checkProgress = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - lastProgressTime > 5000) {
            clearInterval(checkProgress);
            handleError("[404] - Brak postępu pobierania. Spróbuj ponownie.");
        }
    }, 1000);

    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            updateProgress(percentComplete);
            lastProgressTime = Date.now();
        }
    };

    xhr.onload = function () {
        clearInterval(checkProgress);
        if (xhr.status === 200) {
            const imgElement = document.getElementById('thumbnailImage');
            const blob = xhr.response;
            const convertedBlobUrl = URL.createObjectURL(blob);

            imgElement.src = convertedBlobUrl;
            imgElement.style.display = 'block';

            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = convertedBlobUrl;
            downloadLink.download = `miniaturka.${format}`;
            downloadLink.style.display = 'inline-block';

            document.getElementById('loadingText').style.display = 'none';
            updateProgress(100);
            setTitle("Pomyślnie pobrano!");
            document.body.style.cursor = 'default';
            setTimeout(() => setTitle("Pobieracz Miniaturki YouTube"), 3000);
        } else {
            handleError("[404] - Miniaturka niedostępna.");
        }
    };

    xhr.onerror = function () {
        clearInterval(checkProgress);
        handleError("[404] - Błąd połączenia.");
    };

    xhr.send();
}

function handleError(message) {
    alert(`Błąd: ${message}`);
    document.getElementById('loadingText').style.display = 'none';
    document.body.style.cursor = 'default';
    setTitle("[404]");
    setTimeout(() => setTitle("Pobieracz Miniaturki YouTube"), 3000);
}
