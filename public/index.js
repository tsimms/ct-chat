(() => {

    const history = document.getElementById('history');

    // Set up socket connection
    socket = io(location.origin);
    socket.on('msg', async (data) => {
        console.log({ data });
        const { time, message } = data;
        history.innerHTML += `
        <div class="row">
        <span class="time">${time}</span>
        <span class="message">${message}</span>
        </div>
        `;
    });    

    // Set up interactivity
    const triggerSend = () => {
        console.log(`Msg: ${inputMsg.value}`);
        socket.emit('msg', inputMsg.value);
        inputMsg.value = '';
    }
    const inputMsg = document.getElementById('chatInput');  
    const sendButton = document.getElementById('chatSend');
    sendButton.addEventListener('click', triggerSend );
    inputMsg.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          triggerSend();
        }
    });

})();
