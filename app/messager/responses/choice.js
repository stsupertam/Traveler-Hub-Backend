let payload_choice = {
    text: '',
    quick_replies:[
    	{
    	  	content_type: 'text',
    	  	title: 'ค้นหาตามใจคุณ',
    	  	payload: 'search',
    	},
    	{
    	  	content_type: 'text',
    	  	title: 'แพ็กเกจยอดนิยม',
    	  	payload: 'popular',
    	},
    	{
    	  	content_type: 'text',
    	  	title: 'แพ็กเกจล่าสุด',
    	  	payload: 'latest',
    	}
    ]
}

let payload_more_question = {
  	text: 'อยากค้นหาเพิ่มเติมอีกไหมครับ',
  	quick_replies:[
    	{
    	  	content_type: 'text',
	    	title: 'ค้นหาในรูปแบบอื่น',
    	  	payload: 'search',
    	},
    	{
    	  	content_type: 'text',
    	  	title: 'หยุดการค้นหา',
    	  	payload: 'stop',
    	},
  ]
}

let payload_search = {
  	text: 'อยากค้นหาเพิ่มเติมอีกไหมครับ',
  	quick_replies:[
    	{
    		content_type: 'text',
    		title: 'เพิ่มเงื่อนไข',
    		payload: 'search',
		},
    	{
    		content_type: 'text',
    		title: 'เริ่มค้นหาใหม่',
    		payload: 'search',
    	},
    	{
    	  	content_type: 'text',
    	  	title: 'ค้นหาในรูปแบบอื่น',
    	  	payload: 'another',
    	},
    	{
    	  	content_type: 'text',
    	  	title: 'หยุดการค้นหา',
    	  	payload: 'stop',
    	},
  ]
}
exports.select = function(choice, unknownType = 'None') {
	payload = {}
    if(choice === 'start') {
		payload_choice['text'] = 'สวัสดีครับ ผมสามารถแนะนำแพ็กเกจที่น่าสนใจได้'
		payload = payload_choice
    } else if(choice === 'other') {
		payload_choice['text'] = 'ค้นหาเกี่ยวกับอะไรดี'
		payload = payload_choice
    } else if(choice == 'more_question'){
		payload = payload_more_question
    } else if(choice == 'search'){
		payload = payload_search
	} else if(choice == 'end'){
	    payload = { text: 'ขอบคุณมากครับที่ใช้บริการ' }
    }
    return payload
}

exports.selectUnknown = function(unknownType = 'None') {
	let payload = {}
	let text = 'ขออภัยด้วยครับ อยากให้เลือกตามตัวเลือกครับ'
	if(unknownType === 'latestAndPopular') {
		payload_more_question['text'] = text
		payload = payload_more_question
	} else if(unknownType === 'choice') {
		payload_choice['text'] = text
		payload = payload_choice
	} else if(unknownType === 'search') {
		payload_search['text'] = text
		payload = payload_search
	}
    return payload
}