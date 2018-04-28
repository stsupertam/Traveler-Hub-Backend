const Package = require('mongoose').model('Package')
const _ = require('lodash')
const rootUrl = 'https://travelerhub.xyz/package/detail/' 
const imageUrl = 'https://api.travelerhub.xyz' 

function getItem(packages) {
    let data = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: []
            }
        }
    }
    let button = [{
        'type': 'web_url',
        'url': '',
        'title': 'More Detail'
    }]
    _.map(packages, (package) => {
        item = {}
        let randomIndex = Math.floor(Math.random()*package.images.length)
        button[0]['url'] = rootUrl + package['_id']
        item['title'] = package['package_name']
        item['subtitle'] = package['human_price'] + '\n' + 
                           package['travel_date'] + '\n' + 'company: ' + 
                           package['company']
        item['image_url'] = imageUrl + package['images'][randomIndex]
        item['buttons'] = button
        data.attachment.payload.elements.push(item)
    })
    return data
}

exports.latest = function() {
    return Package.find({}).sort('-created').limit(10).select('-__v -created').lean()
            .then((packages) => {
                return getItem(packages)
            })
}

exports.popular = function() {
    return Package.find({}).sort('-number_of_views').limit(10).select('-__v -created').lean()
            .then((packages) => {
                return getItem(packages)
            })

}

exports.search = function(query) {
    console.log('Hello Word')
    return Package.find({package_name: 'eiei'}).limit(1).sort('-number_of_views').select('-__v -created').lean()
            .then((packages) => {
                if(packages.length === 0) {
                    console.log('Thje bessfdjldfjl')
                    return { text: 'หาแพ็กเกจที่ต้องการไม่เจอ' }
                }
                return getItem(packages)
            })
}