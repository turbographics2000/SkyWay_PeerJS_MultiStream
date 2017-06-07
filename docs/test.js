var debugLevel = 2;
var deviceIdx = 0;
var peer = new Peer({ key: 'ce16d9aa-4119-4097-a8a5-3a5016c6a81c', /*debug: 3*/ });

peer.on('open', id => {
  console.log('peer on "open"');
  myIdDisp.textContent = id;
  navigator.mediaDevices.enumerateDevices().then(devs => {
    var videoDevices = devs.filter(device => device.kind === 'videoinput');
    if (videoDevices.length > 0) {
      devices = videoDevices;
      btnAddStream.style.display = '';
    }
  });
});

peer.on('call', call => {
  console.log('peer on "call"');
  callSetup(call);
});

btnAddStream.onclick = function (evt) {
  addStream({ deviceId: { exact: devices[deviceIdx].deviceId } });
  deviceIdx++;
  if (deviceIdx === devices.length) {
    btnAddStream.style.display = 'none';
  }
}

function createVideoElm(container, stream) {
  var vid = document.createElement('video');
  vid.onloadedmetadata = evt => {
    vid.style.width = (vid.videoWidth / vid.videoHeight * 160) + 'px';
    vid.style.height = '160px';
    vid.play();
    container.appendChild(vid);
  }
  vid.srcObject = stream;
}

function addStream(video = false, audio = false) {
  var constraints = { video: video, audio: audio };
  console.log('constraints', constraints);
  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    createVideoElm(selfViewContainer, stream);
    var call = peer.call(callTo.value, stream);
    callSetup(call);
  });
}

function webCamSetup(elm) {
  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(stream => {
    elm.srcObject = stream;
    return stream;
  }).catch(ex => console.log('getUserMedia error.', ex));
}

function callSetup(call) {
  call.on('stream', stream => {
    console.log('call on "stream"');
    createVideoElm(remoteViewContainer, stream);
  });
  call.on('close', _ => {
    console.log('call on "close"');
  });
}