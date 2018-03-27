let payload = { 
    attachment: {
        type: 'template',
        payload: {
            template_type: 'button',
            text: message,
            buttons: [
                {
                    type: 'postback',
                    title: 'ค้นหาตามชื่อแพ็กเกจ',
                    payload: 'search',
                },
                {
                    type: 'postback',
                    title: 'แพ็กเกจยอดนิยม',
                    payload: 'popular',
                },
                {
                    type: 'postback',
                    title: 'แพ็กเกจล่าสุด',
                    payload: 'latest',
                },
                {
                    type: 'postback',
                    title: 'แนะนำตามใจคุณ',
                    payload: 'question'
                },
            ]
        }
    }
}
