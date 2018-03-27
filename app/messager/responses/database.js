const Package = require('mongoose').model('Package')
const _ = require('lodash')
const rootUrl = 'localhost:3000/package/' 

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
        button[0]['url'] = rootUrl + package['package_id']
        item['title'] = package['package_name']
        item['subtitle'] = package['human_price'] + '\n' + package['travel_date']
        item['image_url'] = package['image']
        item['buttons'] = button
        data.attachment.payload.elements.push(item)
    })
    return data
}

exports.latest = function() {
    return Package.find({}).sort('-created').limit(5).select('-_id -__v -created')
            .then((packages) => {
                return getItem(packages)
            })
}

exports.popular = function() {
    return Package.find({}).sort('-number_of_views').limit(5).select('-_id -__v -created')
            .then((packages) => {
                return getItem(packages)
            })

}

exports.search = function(query) {
    return Package.find({ $text: { $search: query }}).sort('-number_of_views').limit(5).select('-_id -__v -created')
            .then((packages) => {
                if(packages.length === 0) {
                    return {text: 'หาแพ็กเกจที่ต้องการไม่เจอ'}
                }
                return getItem(packages)
            })
}

