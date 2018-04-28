const _ = require('lodash')
const Package = require('mongoose').model('Package')
const Promise = require('bluebird')
const wordcut = require('wordcut')
const rootUrl = 'https://travelerhub.xyz/package/detail/' 
const imageUrl = 'https://api.travelerhub.xyz' 

Package.esSearch = Promise.promisify(Package.esSearch);

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
        let copyPackage = JSON.parse(JSON.stringify(package))
        let images = copyPackage.images
        item = {}
        let randomIndex = Math.floor(Math.random()*images.length)
        button[0]['url'] = rootUrl + package['_id']
        item['title'] = package['package_name']
        item['subtitle'] = package['human_price'] + '\n' + 
                           package['travel_date'] + '\n' + 'company: ' + 
                           package['company']
        item['image_url'] = imageUrl + images[randomIndex]
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

exports.search = async function(message) {
    let raw_query = {
        size: 10,
    }
    let elastic_query = { 
        bool : {
            must : [],
            filter : []
        },
    }
    let text_tokenization = wordcut.cut(message)
    text_tokenization.replace('|', ' ')
    let text = {
        match: {
            text: {
                query: text_tokenization,
                operator: 'and',
                fuzziness: 'AUTO',
            }
        }
    }
    elastic_query['bool']['must'].push(text)
    raw_query['query'] = elastic_query

    return Package.esSearch(raw_query)
            .then((packages) => {
                return getItem(packages.hits.hits)
            })
}