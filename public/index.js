(() => {

    const history = document.getElementById('history');
    const userCount = document.getElementById('user-count');
    const renderEntry = (data) => {
        console.log({ data });
        const { time, text, user } = data;
        let color, nickname;
        if (user) {
            ({ color, nickname } = user);
        } else {
            color = "#000";
            nickname = 'System Bot';
        }
        history.innerHTML += `
        <div class="row">
        <span style="color: ${color}" class="nickname">${nickname}</span>
        <span class="time">${time}</span>
        <span class="message">${text}</span>
        </div>
        `;
    }

    // Set up socket connection
    let socket;
    const initSocket = () => {
        socket = io(location.origin);
        socket.emit('getHistory');
        socket.on('history', (messages) => {
            messages.forEach(entry => {
                renderEntry(entry);
            });
        });
        socket.on('msg', (data) => renderEntry(data));    
    
        socket.on('userCountChange', (data) => {
            const { currentUserCount } = data;
            userCount.innerHTML = `Online Users: ${currentUserCount}`;
        });
    }

    // Set up interactivity
    const triggerSendMessage = () => {
        console.log(`Msg: ${inputMsg.value}`);
        socket.emit('msg', { text: inputMsg.value });
        inputMsg.value = '';
    }
    const triggerSendNickname = () => {
        const { value } = nickname;
        console.log(`Nickname: ${value}`);
        initSocket();
        socket.emit('nickname', value);
        const nicknameModal = document.getElementById('nickname-modal');
        const nicknameValue = document.getElementById('nickname-value');
        nicknameModal.classList.add('hide');
        nicknameValue.innerHTML = value;
    }
    const nickname = document.getElementById('nickname');
    const inputMsg = document.getElementById('chatInput');  
    const sendButton = document.getElementById('chatSend');
    sendButton.addEventListener('click', triggerSendMessage );
    inputMsg.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          triggerSendMessage();
        }
    });
    nickname.focus();
    nickname.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            triggerSendNickname();
        }
    });

    window['_fs_host'] = 'staging.fullstory.com';
    window['_fs_script'] = 'edge.staging.fullstory.com/s/fs.js';
    window['_fs_org'] = 'o-9786-na1';
    window['_fs_namespace'] = 'FS';
    !function(m,n,e,t,l,o,g,y){var s,f,a=function(h){
    return!(h in m)||(m.console&&m.console.log&&m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].'),!1)}(e)
    ;function j(b){var h,d=[];function k(){h&&(d.forEach((function(b){var d;try{d=b[h[0]]&&b[h[0]](h[1])}catch(h){return void(b[3]&&b[3](h))}
    d&&d.then?d.then(b[2],b[3]):b[2]&&b[2](d)})),d.length=0)}function r(b){return function(d){h||(h=[b,d],k())}}return b(r(0),r(1)),{
    then:function(b,h){return j((function(r,i){d.push([b,h,r,i]),k()}))}}}a&&(g=m[e]=function(){var b=function(b,d,k,r){function i(i,c){
    h(b,d,k,i,c,r)}r=r||2;var c,u=/Async$/;return u.test(b)?(b=b.replace(u,""),"function"==typeof Promise?new Promise(i):j(i)):h(b,d,k,c,c,r)}
    ;function h(h,d,k,r,i,c){return b._api?b._api(h,d,k,r,i,c):(b.q&&b.q.push([h,d,k,r,i,c]),null)}return b.q=[],b}(),y=function(b){function h(h){
    "function"==typeof h[4]&&h[4](new Error(b))}var d=g.q;if(d){for(var k=0;k<d.length;k++)h(d[k]);d.length=0,d.push=h}},function(){
    (o=n.createElement(t)).async=!0,o.crossOrigin="anonymous",o.src="https://"+l,o.onerror=function(){y("Error loading "+l)}
    ;var b=n.getElementsByTagName(t)[0];b.parentNode.insertBefore(o,b)}(),function(){function b(){}function h(b,h,d){g(b,h,d,1)}function d(b,d,k){
    h("setProperties",{type:b,properties:d},k)}function k(b,h){d("user",b,h)}function r(b,h,d){k({uid:b},d),h&&k(h,d)}g.identify=r,g.setUserVars=k,
    g.identifyAccount=b,g.clearUserCookie=b,g.setVars=d,g.event=function(b,d,k){h("trackEvent",{name:b,properties:d},k)},g.anonymize=function(){r(!1)
    },g.shutdown=function(){h("shutdown")},g.restart=function(){h("restart")},g.log=function(b,d){h("log",{level:b,msg:d})},g.consent=function(b){
    h("setIdentity",{consent:!arguments.length||b})}}(),s="fetch",f="XMLHttpRequest",g._w={},g._w[f]=m[f],g._w[s]=m[s],m[s]&&(m[s]=function(){
    return g._w[s].apply(this,arguments)}),g._v="2.0.0")}(window,document,window._fs_namespace,"script",window._fs_script);

})();
