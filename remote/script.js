Storage.prototype.setObject = function(key, value) { 
    this.setItem(key, JSON.stringify(value)); 
}
Storage.prototype.getObject = function(key) { 
    var value = this.getItem(key);
    return value && JSON.parse(value); 
}

let NavOpen = false;
function _(x) {return document.getElementById(x);}
const sideNav = _("sideNav");
const mainContent = _("mainContent");
const page_home = _('page-home');
const page_about = _('page-about');
const previewScreenBox = _('previewScreenBox');

function openNav() {
    sideNav.style.transform = "translateX(0)";
    mainContent.style.transform = "translateX(60%)";
    mainContent.style.marginLeft = "10px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.5)";
    NavOpen = true;
}
function closeNav() {
    sideNav.style.transform = "translateX(calc(-100% - 4px))";
    mainContent.style.transform = "translateX(0)";
    mainContent.style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
    NavOpen = false;
}
function swipeCloseNavbar(el,d) {
    document.activeElement.blur();
    if (NavOpen && d=='l') {
        closeNav();
    }else if (!NavOpen && d=='r') {
        openNav();
    }
}
function openPage(pageName) {
    switch (pageName) {
        case 'home':
            page_home.style.display = 'block';
            page_handshake.style.display = 'none';
            page_about.style.display = 'none';
            break;
        case 'about':
            page_home.style.display = 'none';
            page_handshake.style.display = 'none';
            page_about.style.display = 'block';
            break;
        default:
            break;
    }
    closeNav();
}
function handlePreviewToggle(toggleEl) {
    screenserver.runInterval(toggleEl);
    if (!toggleEl) {
        previewScreenBox.style.backgroundImage = 'url(/churchZoomIcon)';
    }
}
async function sendBtnPress(path) {
    fetch(path);
}

function showAlert(alertBoxId, timeMillis=4000) {
    _(alertBoxId).style.opacity = '1';
    setTimeout(function() {
        _(alertBoxId).style.opacity = '0'
    }, timeMillis);
}

// socket.io stuff
class SCREEN_server {
    constructor() {
        this.serving = false;
        this.url = new URL(window.location.href);
        this.socket = io.connect(this.url.protocol + '//' + this.url.host);
        this.socket.on('image', (data) => {
            var bytes = new Uint8Array(data);
            if (this.serving) {
                previewScreenBox.style.backgroundImage = `url(data:image/jpeg;base64,${this.encode(bytes)})`;
            }
        });
        this.socket.on('webinarEnded', ()=>{
            showAlert('errorBox');
            handlePreviewToggle(false);
        });
    }
    runInterval(TorF) {
        this.serving = TorF;
        if (TorF) {
            this.screenInterval = setInterval(() => {
                this.socket.volatile.emit("pingImage");
            }, 500);
        } else {
            clearInterval(this.screenInterval);
        }
    }
    encode (input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
    
        while (i < input.length) {
            chr1 = input[i++];
            chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
            chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here
    
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
    
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                      keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return output;
    }
}

const screenserver = new SCREEN_server();

// end socket.io stuff

function detectswipe(el,func) {
    swipe_det = new Object();
    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
    var min_x = 30;  //min x swipe for horizontal swipe
    var max_x = 30;  //max x difference for vertical swipe
    var min_y = 50;  //min y swipe for vertical swipe
    var max_y = 60;  //max y difference for horizontal swipe
    var direc = "";
    ele = _(el);
    ele.addEventListener('touchstart',function(e){
      var t = e.touches[0];
      swipe_det.sX = t.screenX; 
      swipe_det.sY = t.screenY;
    },false);
    ele.addEventListener('touchmove',function(e){
      e.preventDefault();
      var t = e.touches[0];
      swipe_det.eX = t.screenX; 
      swipe_det.eY = t.screenY;    
    },false);
    ele.addEventListener('touchend',function(e){
      //horizontal detection
      if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
        if(swipe_det.eX > swipe_det.sX) direc = "r";
        else direc = "l";
      }
      //vertical detection
      else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
        if(swipe_det.eY > swipe_det.sY) direc = "d";
        else direc = "u";
      }
  
      if (direc != "") {
        if(typeof func == 'function') func(el,direc);
      }
      direc = "";
      swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
    },false);  
}

detectswipe('mainContent', swipeCloseNavbar);
detectswipe('sideNav', swipeCloseNavbar);